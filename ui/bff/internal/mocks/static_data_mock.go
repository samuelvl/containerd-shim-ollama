package mocks

import (
	"context"
	"log/slog"
	"os"

	"github.com/google/uuid"
	"github.com/kubeflow/ollama/ui/bff/internal/constants"
	"github.com/kubeflow/ollama/ui/bff/internal/models"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func NewMockSessionContext(parent context.Context) context.Context {
	if parent == nil {
		parent = context.TODO()
	}
	traceId := uuid.NewString()
	ctx := context.WithValue(parent, constants.TraceIdKey, traceId)

	traceLogger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	ctx = context.WithValue(ctx, constants.TraceLoggerKey, traceLogger)
	return ctx
}

func GetConfigMapMock() corev1.ConfigMap {
	return corev1.ConfigMap{
		TypeMeta: metav1.TypeMeta{
			APIVersion: "v1",
			Kind:       "ConfigMap",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: "model-catalog-sources",
			Labels: map[string]string{
				"opendatahub.io/dashboard": "true",
			},
		},
		Data: map[string]string{
			"modelCatalogSources": `{
  "sources": [
	{
	  "source": "Ollama",
	  "models": [
		{
		  "repository": "ollama",
		  "name": "qwen2",
		  "displayName": "Qwen2 vl-7b-instruct",
		  "provider": "Alibaba",
		  "description": "A fine-tuned model based on Qwen-2.5-VL-7B, optimized for instruction-following tasks.",
		  "longDescription": "A fine-tuned model based on Qwen-2.5-VL-7B, optimized for instruction-following tasks.",
		  "logo": "data:image/webp;base64,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",
		  "readme": "# Qwen2.5-VL-7B-Instruct\n\n## Introduction\n\nIn the past five months since Qwen2-VL's release, numerous developers have built new models on the Qwen2-VL vision-language models, providing us with valuable feedback. During this period, we focused on building more useful vision-language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5-VL.\n\n#### Key Enhancements:\n* **Understand things visually**: Qwen2.5-VL is not only proficient in recognizing common objects such as flowers, birds, fish, and insects, but it is highly capable of analyzing texts, charts, icons, graphics, and layouts within images.\n\n* **Being agentic**: Qwen2.5-VL directly plays as a visual agent that can reason and dynamically direct tools, which is capable of computer use and phone use.\n\n* **Understanding long videos and capturing events**: Qwen2.5-VL can comprehend videos of over 1 hour, and this time it has a new ability of cpaturing event by pinpointing the relevant video segments.\n\n* **Capable of visual localization in different formats**: Qwen2.5-VL can accurately localize objects in an image by generating bounding boxes or points, and it can provide stable JSON outputs for coordinates and attributes.\n\n* **Generating structured outputs**: for data like scans of invoices, forms, tables, etc. Qwen2.5-VL supports structured outputs of their contents, benefiting usages in finance, commerce, etc.\n\n\n#### Model Architecture Updates:\n\n* **Dynamic Resolution and Frame Rate Training for Video Understanding**:\n\nWe extend dynamic resolution to the temporal dimension by adopting dynamic FPS sampling, enabling the model to comprehend videos at various sampling rates. Accordingly, we update mRoPE in the time dimension with IDs and absolute time alignment, enabling the model to learn temporal sequence and speed, and ultimately acquire the ability to pinpoint specific moments.\n\n<p align=\"center\">\n    <img src=\"https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen2.5-VL/qwen2.5vl_arc.jpeg\" width=\"80%\"/>\n<p>\n\n\n* **Streamlined and Efficient Vision Encoder**\n\nWe enhance both training and inference speeds by strategically implementing window attention into the ViT. The ViT architecture is further optimized with SwiGLU and RMSNorm, aligning it with the structure of the Qwen2.5 LLM.\n\n\nWe have three models with 3, 7 and 72 billion parameters. This repo contains the instruction-tuned 7B Qwen2.5-VL model. For more information, visit our [Blog](https://qwenlm.github.io/blog/qwen2.5-vl/) and [GitHub](https://github.com/QwenLM/Qwen2.5-VL).\n\n## Evaluation\n\n### Image benchmark\n\n\n| Benchmark | InternVL2.5-8B | MiniCPM-o 2.6 | GPT-4o-mini | Qwen2-VL-7B |**Qwen2.5-VL-7B** |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| MMMU<sub>val</sub>  | 56 | 50.4 | **60**| 54.1 | 58.6|\n| MMMU-Pro<sub>val</sub>  | 34.3 | - | 37.6| 30.5 | 41.0|\n| DocVQA<sub>test</sub>  | 93 | 93 | - | 94.5 | **95.7** |\n| InfoVQA<sub>test</sub>  | 77.6 | - |  - |76.5 | **82.6** |\n| ChartQA<sub>test</sub>  | 84.8 | - |- | 83.0 |**87.3** |\n| TextVQA<sub>val</sub>  | 79.1 | 80.1 | -| 84.3 | **84.9**|\n| OCRBench | 822 | 852 | 785 | 845 | **864** |\n| CC_OCR | 57.7 |  | | 61.6 | **77.8**|\n| MMStar | 62.8| | |60.7| **63.9**|\n| MMBench-V1.1-En<sub>test</sub>  | 79.4 | 78.0 | 76.0| 80.7 | **82.6** |\n| MMT-Bench<sub>test</sub> | - | - | - |**63.7** |63.6 |\n| MMStar | **61.5** | 57.5 |  54.8 | 60.7 |63.9 |\n| MMVet<sub>GPT-4-Turbo</sub>  | 54.2 | 60.0 | 66.9 | 62.0 | **67.1**|\n| HallBench<sub>avg</sub>  | 45.2 | 48.1 | 46.1| 50.6 | **52.9**|\n| MathVista<sub>testmini</sub>  | 58.3 | 60.6 | 52.4 | 58.2 | **68.2**|\n| MathVision  | - | -  | - | 16.3 | **25.07** |\n\n### Video Benchmarks\n\n| Benchmark |  Qwen2-VL-7B | **Qwen2.5-VL-7B** |\n| :--- | :---: | :---: |\n| MVBench |  67.0 | **69.6** |\n| PerceptionTest<sub>test</sub>  | 66.9 | **70.5** |\n| Video-MME<sub>wo/w subs</sub>   | 63.3/69.0 | **65.1**/**71.6** |\n| LVBench  |  | 45.3 |\n| LongVideoBench  |  | 54.7 |\n| MMBench-Video | 1.44 | 1.79 |\n| TempCompass |  | 71.7 |\n| MLVU |  | 70.2 |\n| CharadesSTA/mIoU |  43.6|\n\n### Agent benchmark\n| Benchmarks              | Qwen2.5-VL-7B |\n|-------------------------|---------------|\n| ScreenSpot              |     84.7    |\n| ScreenSpot Pro          |     29.0    |\n| AITZ_EM                 |  \t81.9    |\n| Android Control High_EM |    \t60.1    |\n| Android Control Low_EM  |  \t93.7    |\n| AndroidWorld_SR         | \t25.5  \t|\n| MobileMiniWob++_SR      | \t91.4    |\n\n## Requirements\nThe code of Qwen2.5-VL has been in the latest Hugging face transformers and we advise you to build from source with command:\n\n## Quickstart\n\nBelow, we provide simple examples to show how to use Qwen2.5-VL with 🤖 ModelScope and 🤗 Transformers.\n\nThe code of Qwen2.5-VL has been in the latest Hugging face transformers and we advise you to build from source with command:...",		  "language": [
			"ar",
			"cs",
			"de",
			"en",
			"es",
			"fr",
			"it",
			"ja",
			"ko",
			"nl",
			"pt",
			"zh"
		  ],
		  "license": "apache-2.0",
		  "licenseLink": "https://www.apache.org/licenses/LICENSE-2.0.txt",
		  "maturity": "Generally Available",
		  "libraryName": "transformers",
		  "baseModel": [
			{
			  "repository": "rhelai1",
			  "name": "granite-8b-code-base"
			}
		  ],
		  "labels": ["language", "qwen2"],
		  "tasks": ["text-generation"],
		  "createTimeSinceEpoch": 1733514949000,
		  "lastUpdateTimeSinceEpoch": 1734637721000,
		  "artifacts": [
			{
			  "protocol": "oci",
			  "createTimeSinceEpoch": 1733514949000,
			  "tags": ["2.5.0"],
			  "uri": "oci://ghcr.io/ollama/qwen2.5-vl-7b-instruct:2.5.0"
			}
		  ],
		  "status": "deployed"
		}
	  ]
	}
  ]
}`,
		},
	}
}

func GetAllModelsMock() []models.ModelCatalogSource {
	model1 := models.CatalogModel{
		Repository:      "ollama",
		Name:            "qwen2",
		DisplayName:     "Qwen2.5 vl-7b-instruct",
		Provider:        "Alibaba",
		Description:     "A fine-tuned model based on Qwen-2.5-VL-7B, optimized for instruction-following tasks.",
		LongDescription: "A fine-tuned model based on Qwen-2.5-VL-7B, optimized for instruction-following tasks.",
		Logo:            "",
		Readme:          "Test",
		Language:        []string{"ar", "cs", "de", "en", "es", "fr", "it", "ja", "ko", "nl", "pt", "zh"},
		License:         "apache-2.0",
		LicenseLink:     "https://www.apache.org/licenses/LICENSE-2.0.txt",
		Maturity:        "Generally Available",
		LibraryName:     "transformers",
		BaseModel: []models.BaseModel{
			{
				Repository: "rhelai1",
				Name:       "granite-8b-code-base",
			},
		},
		Labels:                   []string{"language", "qwen2"},
		Tasks:                    []string{"text-generation"},
		CreateTimeSinceEpoch:     1733514949000,
		LastUpdateTimeSinceEpoch: 1734637721000,
		Artifacts: []models.CatalogArtifacts{
			{
				Protocol:             "oci",
				CreateTimeSinceEpoch: 1733514949000,
				Tags:                 []string{"2.5.0"},
				URI:                  "oci://ghcr.io/ollama/qwen2.5-vl-7b-instruct:2.5.0",
			},
		},
		Status: "deployed",
	}

	return []models.ModelCatalogSource{
		{
			Source: "ollama",
			Models: []models.CatalogModel{
				model1,
			},
		},
	}
}

func NewMockSessionContextNoParent() context.Context {
	return NewMockSessionContext(context.TODO())
}
