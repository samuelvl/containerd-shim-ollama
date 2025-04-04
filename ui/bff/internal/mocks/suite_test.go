package mocks

import (
	"context"
	"log/slog"
	"os"
	"testing"

	k8s "github.com/kubeflow/ollama/ui/bff/internal/integrations"
	logf "sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"

	. "github.com/onsi/ginkgo/v2"

	. "github.com/onsi/gomega"
)

// These tests use Ginkgo (BDD-style Go testing framework). Refer to
// http://onsi.github.io/ginkgo/ to learn more about Ginkgo.

var (
	k8sClient k8s.KubernetesClientInterface
	ctx       context.Context
	cancel    context.CancelFunc
	logger    *slog.Logger
	err       error
)

func TestAPI(t *testing.T) {
	RegisterFailHandler(Fail)

	RunSpecs(t, "API Suite")
}

var _ = BeforeSuite(func() {
	defer GinkgoRecover()
	logf.SetLogger(zap.New(zap.WriteTo(GinkgoWriter), zap.UseDevMode(true)))
	ctx, cancel = context.WithCancel(context.Background())

	By("bootstrapping test environment")
	logger = slog.New(slog.NewTextHandler(os.Stdout, nil))

	k8sClient, err = NewKubernetesClient(logger, ctx, cancel)
	Expect(err).NotTo(HaveOccurred())
})

var _ = AfterSuite(func() {
	By("tearing down the test environment")
	defer cancel()
	err := k8sClient.Shutdown(ctx, logger)
	Expect(err).NotTo(HaveOccurred())
})
