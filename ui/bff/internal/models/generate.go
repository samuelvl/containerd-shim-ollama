package models

// GenerateOptions represents the options for the generate request
type GenerateOptions struct {
	NumKeep          *int     `json:"num_keep,omitempty"`
	Seed             *int     `json:"seed,omitempty"`
	NumPredict       *int     `json:"num_predict,omitempty"`
	TopK             *int     `json:"top_k,omitempty"`
	TopP             *float64 `json:"top_p,omitempty"`
	MinP             *float64 `json:"min_p,omitempty"`
	TypicalP         *float64 `json:"typical_p,omitempty"`
	RepeatLastN      *int     `json:"repeat_last_n,omitempty"`
	Temperature      *float64 `json:"temperature,omitempty"`
	RepeatPenalty    *float64 `json:"repeat_penalty,omitempty"`
	PresencePenalty  *float64 `json:"presence_penalty,omitempty"`
	FrequencyPenalty *float64 `json:"frequency_penalty,omitempty"`
	Mirostat         *int     `json:"mirostat,omitempty"`
	MirostatTau      *float64 `json:"mirostat_tau,omitempty"`
	MirostatEta      *float64 `json:"mirostat_eta,omitempty"`
	PenalizeNewline  *bool    `json:"penalize_newline,omitempty"`
	Stop             []string `json:"stop,omitempty"`
	Numa             *bool    `json:"numa,omitempty"`
	NumCtx           *int     `json:"num_ctx,omitempty"`
	NumBatch         *int     `json:"num_batch,omitempty"`
	NumGPU           *int     `json:"num_gpu,omitempty"`
	MainGPU          *int     `json:"main_gpu,omitempty"`
	LowVram          *bool    `json:"low_vram,omitempty"`
	VocabOnly        *bool    `json:"vocab_only,omitempty"`
	UseMmap          *bool    `json:"use_mmap,omitempty"`
	UseMlock         *bool    `json:"use_mlock,omitempty"`
	NumThread        *int     `json:"num_thread,omitempty"`
}

// GenerateRequest represents the request to generate a response from an LLM
type GenerateRequest struct {
	Model     string           `json:"model"`
	Prompt    string           `json:"prompt"`
	Suffix    *string          `json:"suffix,omitempty"`
	Images    []string         `json:"images,omitempty"`
	Format    *string          `json:"format,omitempty"`
	Options   *GenerateOptions `json:"options,omitempty"`
	System    *string          `json:"system,omitempty"`
	Template  *string          `json:"template,omitempty"`
	Stream    *bool            `json:"stream,omitempty"`
	Raw       *bool            `json:"raw,omitempty"`
	KeepAlive *string          `json:"keep_alive,omitempty"`
	Context   []int            `json:"context,omitempty"`
}

// GenerateResponse represents the response from the LLM
type GenerateResponse struct {
	Model              string  `json:"model"`
	CreatedAt          string  `json:"created_at"`
	Response           string  `json:"response"`
	Done               bool    `json:"done"`
	DoneReason         *string `json:"done_reason,omitempty"`
	Context            []int   `json:"context,omitempty"`
	TotalDuration      int     `json:"total_duration,omitempty"`
	LoadDuration       int     `json:"load_duration,omitempty"`
	PromptEvalCount    int     `json:"prompt_eval_count,omitempty"`
	PromptEvalDuration int     `json:"prompt_eval_duration,omitempty"`
	EvalCount          int     `json:"eval_count,omitempty"`
	EvalDuration       int     `json:"eval_duration,omitempty"`
}
