# Understanding Containerd Internals

This document provides an in-depth exploration of Containerd's internal workings, specifically focusing on the container lifecycle from creation to execution. Through detailed code analysis and log examination, we trace the key processes involved in running containers.

Each section includes relevant log snippets and code examples to illustrate how Containerd implements these processes, providing insight into container orchestration at the system level.

## 1. Pod Sandbox Creation

```
time="2025-02-27T20:28:41.299717426Z" level=info msg="RunPodSandbox for &PodSandboxMetadata{Name:test-model-859c6ccf5f-66688,Uid:d2700206-7b73-4707-90d1-a153b5a16fde,Namespace:ollama,Attempt:0,}"
```

The pod sandbox creation process begins in the `RunPodSandbox` function, implemented in sandbox_run.go:

```go
// RunPodSandbox creates and starts a pod-level sandbox. Runtimes should ensure
// the sandbox is in ready state.
func (c *criService) RunPodSandbox(ctx context.Context, r *runtime.RunPodSandboxRequest) (_ *runtime.RunPodSandboxResponse, retErr error) {
    // Generate unique id and name for the sandbox and reserve the name.
    id := util.GenerateID()
    metadata := config.GetMetadata()
    name := makeSandboxName(metadata)
    
    // ...reserve name, setup network, create sandbox container...
}
```

The function generates a unique ID for the sandbox (e.g. `2c26f890efce9f4...`). This ID is critical as it's used throughout the container lifecycle.

## 2. Container Networking Setup

```
time="2025-02-27T20:28:41.310635221Z" level=debug msg="begin cni setup" 
time="2025-02-27T20:28:41.322752753Z" level=debug msg="cni result: {...}"
```

Network setup is handled by `setupPodNetwork` in sandbox_run.go:

```go
// setupPodNetwork setups up the network for a pod
func (c *criService) setupPodNetwork(ctx context.Context, sandbox *sandboxstore.Sandbox) error {
    var (
        id        = sandbox.ID
        config    = sandbox.Config
        path      = sandbox.NetNSPath
        netPlugin = c.getNetworkPlugin(sandbox.RuntimeHandler)
    )
    
    // ...get network namespace options...
    
    log.G(ctx).WithField("podsandboxid", id).Debugf("begin cni setup")
    netStart := time.Now()
    if c.config.CniConfig.NetworkPluginSetupSerially {
        result, err = netPlugin.SetupSerially(ctx, id, path, opts...)
    } else {
        result, err = netPlugin.Setup(ctx, id, path, opts...)
    }
    
    // ...check result and store IP addresses...
    
    // Check if the default interface has IP config
    if configs, ok := result.Interfaces[defaultIfName]; ok && len(configs.IPConfigs) > 0 {
        sandbox.IP, sandbox.AdditionalIPs = selectPodIPs(ctx, configs.IPConfigs, c.config.IPPreference)
        sandbox.CNIResult = result
        return nil
    }
}
```

The network setup includes:
- Creating network namespace
- Configuring network interfaces and routing
- Setting up DNS
- Adding pod-related labels to the CNI configuration

The logs show the result with IP `10.244.0.11`, interfaces (`eth0`, `lo`, `veth`), and DNS configuration.

## 3. OCI Runtime Selection & Container Spec Generation

```
time="2025-02-27T20:28:41.329128849Z" level=debug msg="use OCI runtime {Type:io.containerd.servingc.v2...}"
time="2025-02-27T20:28:41.329392680Z" level=debug msg="sandbox container spec: (*specs.Spec)..."
```

The sandbox container spec is generated in `sandboxContainerSpec` within sandbox_run_linux.go:

```go
func (c *Controller) sandboxContainerSpec(id string, config *runtime.PodSandboxConfig,
    imageConfig *imagespec.ImageConfig, nsPath string, runtimePodAnnotations []string) (_ *runtimespec.Spec, retErr error) {
    // Creates a spec Generator with the default spec.
    specOpts := []oci.SpecOpts{
        oci.WithoutRunMount,
        customopts.WithoutDefaultSecuritySettings,
        customopts.WithRelativeRoot(relativeRootfsPath),
        oci.WithEnv(imageConfig.Env),
        oci.WithRootFSReadonly(),
        oci.WithHostname(config.GetHostname()),
    }
    
    // ...configure namespaces, security context, sysctls...
    
    // Add container annotations
    specOpts = append(specOpts, annotations.DefaultCRIAnnotations(id, "", c.getSandboxImageName(), config, true)...)

    return c.runtimeSpec(id, "", specOpts...)
}
```

This creates a comprehensive OCI specification that includes:
- Process details (args, env, capabilities)
- Namespace configurations
- Mounts and filesystem setup
- Resource limitations
- Security settings

## 4. Shim Process Creation

```
time="2025-02-27T20:28:41.356386838Z" level=info msg="connecting to shim 2c26f890efce9f4..." 
```

The "shim" is an intermediary process between containerd and the container runtime (like runc). It's created when starting the container task:

```go
// From internal/cri/server/podsandbox/sandbox_run.go
task, err := container.NewTask(ctx, containerdio.NullIO, taskOpts...)
if err != nil {
    return cin, fmt.Errorf("failed to create containerd task: %w", err)
}
```

The shim process:
- Maintains container lifecycle even if containerd restarts
- Handles standard I/O streams
- Reports container exit status
- Implements the containerd runtime v2 shim API

## 5. Image Pulling

```
time="2025-02-27T20:28:41.386731918Z" level=info msg="PullImage \"docker.io/mccutchen/go-httpbin:latest\""
```

After creating the sandbox, containerd pulls the container image defined by the function in sandbox_run.go:

```go
func (c *Controller) ensureImageExists(ctx context.Context, ref string, config *runtime.PodSandboxConfig, runtimeHandler string) (*imagestore.Image, error) {
    image, err := c.imageService.LocalResolve(ref)
    if err != nil && !errdefs.IsNotFound(err) {
        return nil, fmt.Errorf("failed to get image %q: %w", ref, err)
    }
    if err == nil {
        return &image, nil
    }
    // Pull image to ensure the image exists
    imageID, err := c.imageService.PullImage(ctx, ref, nil, config, runtimeHandler)
    if err != nil {
        return nil, fmt.Errorf("failed to pull image %q: %w", ref, err)
    }
    newImage, err := c.imageService.GetImage(imageID)
    // ...
    return &newImage, nil
}
```

This process includes:
1. Resolving the image name to a registry endpoint
2. Contacting the registry (mirror.gcr.io in this case)
3. Downloading the manifest and configuration
4. Pulling and unpacking the individual layers

## 6. Layer Processing

```
time="2025-02-27T20:28:42.943168518Z" level=debug msg="layer unpacked" duration=2.26085ms layer="sha256:cbeee09c6b35bb..."
```

Containerd unpacks each layer of the container image using its snapshotter system. This is configured when creating the container:

```go
// From internal/cri/server/podsandbox/sandbox_run.go
opts := []containerd.NewContainerOpts{
    containerd.WithSnapshotter(c.imageService.RuntimeSnapshotter(ctx, ociRuntime)),
    customopts.WithNewSnapshot(id, containerdImage, snapshotterOpt...),
    // ...other container options...
}
```

The snapshotter implementation efficiently unpacks layers, with each layer taking only 1-3ms as shown in the logs.

## 7. Container Creation Inside Sandbox

```
time="2025-02-27T20:28:42.979776279Z" level=info msg="CreateContainer within sandbox \"2c26f890efce9f..." 
```

Container creation within the pod sandbox is handled by `CreateContainer` in container_create.go:

```go
// CreateContainer creates a new container in the given PodSandbox.
func (c *criService) CreateContainer(ctx context.Context, r *runtime.CreateContainerRequest) (_ *runtime.CreateContainerResponse, retErr error) {
    // Generate unique id and name for the container and reserve the name.
    id := util.GenerateID()
    metadata := config.GetMetadata()
    containerName := metadata.Name
    name := makeContainerName(metadata, sandboxConfig.GetMetadata())
    log.G(ctx).Debugf("Generated id %q for container %q", id, name)
    
    // ...build container spec, create container...
    
    spec, err := c.buildContainerSpec(
        platform,
        id,
        sandboxID,
        sandboxPid,
        sandbox.NetNSPath,
        containerName,
        imageName,
        config,
        sandboxConfig,
        &image.ImageSpec.Config,
        // ...
    )
}
```

This process includes:
- Generating a unique ID for the container
- Creating a detailed OCI spec for the application container
- Setting up namespaces to join the sandbox's network, IPC, etc.
- Configuring mounts, environment variables, etc.

## 8. Container Startup

```
time="2025-02-27T20:28:42.993647541Z" level=info msg="StartContainer for \"6c60444825b68de..."
time="2025-02-27T20:28:43.009668072Z" level=info msg="StartContainer for \"6c60444825b68de..." returns successfully"
```

Finally, the container is started and logging is setup:

```go
// From internal/cri/server/container_start.go (implied)
// StartContainer starts the container.
func (c *criService) StartContainer(ctx context.Context, r *runtime.StartContainerRequest) (*runtime.StartContainerResponse, error) {
    // Setup logging
    log.G(ctx).Debugf("Start writing stream %q to log file %q", stdout, logPath)
    
    // ...start container task...
    
    // Start container task
    task.Start(ctx)
    
    // ...handle task exit...
}
```

The logs show containerd setting up log file redirection:

```
time="2025-02-27T20:28:42.993724915Z" level=debug msg="Start writing stream \"stdout\" to log file \"/var/log/pods/ollama_test-model-859c6ccf5f-66688_d2700206-7b73-4707-90d1-a153b5a16fde/httpbin/0.log\""
```