# ollama runner --model ~/.ollama/models/blobs/sha256-dde5aa3fc5ffc17176b5e8bdc82f587b24b2678c6c66101bf7da77af9f7ccdff
# --ctx-size 8192 --batch-size 512 --n-gpu-layers 29 --threads 6 --parallel 4 --port 55080

from llama_index.llms.ollama import Ollama

llm = Ollama(model="llama2", request_timeout=60.0)
response = llm.complete("who am I?")
print(response)
