<div align="center">
  <div>
    <img src="https://github.com/tak-bro/aipick/blob/main/img/demo_min.gif?raw=true" alt="AIPick"/>
    <h1 align="center">AIPick</h1>
  </div>
  <p>
    An interactive CLI tool leveraging multiple AI models for quick handling of simple requests
  </p>
</div>

<div align="center" markdown="1">

[![tak-bro](https://img.shields.io/badge/by-tak--bro-293462?logo=github)](https://github.com/tak-bro)
[![license](https://img.shields.io/badge/license-MIT-211A4C.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0ibTMgNiAzIDFtMCAwLTMgOWE1IDUgMCAwIDAgNi4wMDEgME02IDdsMyA5TTYgN2w2LTJtNiAyIDMtMW0tMyAxLTMgOWE1IDUgMCAwIDAgNi4wMDEgME0xOCA3bDMgOW0tMy05LTYtMm0wLTJ2Mm0wIDE2VjVtMCAxNkg5bTMgMGgzIi8+PC9zdmc+)](https://github.com/tak-bro/aipick/blob/main/LICENSE)
[![version](https://img.shields.io/npm/v/aipick?logo=semanticrelease&label=release&color=A51C2D)](https://www.npmjs.com/package/aipick)
[![downloads](https://img.shields.io/npm/dt/aipick?color=F33535&logo=npm)](https://www.npmjs.com/package/aipick)

</div>

---

## Introduction

_aipick_ is an interactive CLI tool leveraging multiple AI models for quick and efficient handling of simple requests such as variable name recommendations.

## Key Features

- **Multi-AI Support**: Integrates with OpenAI, Anthropic Claude, Google Gemini, Mistral AI, and more.
- **Reactive CLI**: Enables simultaneous requests to multiple AIs and selection of the best AI response.
- **Custom System Prompt**: Supports user-defined system prompt templates.
- **Clipboard Integration**: Automatically copies selected responses to the clipboard for easy use.

## Supported Providers

### Remote

- [OpenAI](https://openai.com/)
- [Anthropic Claude](https://console.anthropic.com/)
- [Gemini](https://gemini.google.com/)
- [Mistral AI](https://mistral.ai/) (including [Codestral](https://mistral.ai/news/codestral/))
- [Cohere](https://cohere.com/)
- [Groq](https://groq.com/)
- [Huggingface **(Unofficial)**](https://huggingface.co/chat/)

### Local

- [Ollama](https://ollama.com/)

## Setup

> The minimum supported version of Node.js is the v18. Check your Node.js version with `node --version`.

1. Install _aipick_:

```sh
npm install -g aipick
```

2. Set up API keys (**at least one key must be set**):

```sh
aipick config set OPENAI.key=<your key>
aipick config set OLLAMA.model=<your local model>
# ... (similar commands for other providers)
```

3. Run aipick:

```sh
aipick -m "Why is the sky blue?"
```

> 👉 **Tip:** Use the `aip` alias if `aipick` is too long for you.

## Using Locally

You can also use your model for free with [Ollama](https://ollama.com/) and it is available to use both Ollama and remote providers **simultaneously**.

1. Install Ollama from [https://ollama.com](https://ollama.com/)

2. Start it with your model

```shell
ollama run llama3.1 # model you want use. ex) codestral, gemma2
```

3. Set the model and host

```sh
aipick config set OLLAMA.model=<your model>
```

> If you want to use ollama, you must set **OLLAMA.model**.

4. Run _aipick_ 
```shell
aipick -m "Why is the sky blue?"
```

> 👉 **Tip:** Ollama can run LLMs **in parallel** from v0.1.33. Please see [this section](#loading-multiple-ollama-models).


## Usage

### CLI Options

- `--message` or `-m`: Message to ask AI (required)
- `--systemPrompt` or `-s`: System prompt for fine-tuning

Example:
```sh
aipick --message "Explain quantum computing" --systemPrompt "You are a physics expert"
```

### Configuration

#### Reading and Setting Configuration

- Read: `aipick config get <key>`
- Set: `aipick config set <key>=<value>`

Example:
```sh
aipick config get OPENAI.key
aipick config set OPENAI.generate=3 GEMINI.temperature=0.5
```

#### How to Configure in detail

1. Command-line arguments: **use the format** `--[ModelName].[SettingKey]=value`

```sh
aipick -m "Why is the sky blue?" --OPENAI.generate=3
```

2. Configuration file: **use INI format in the `~/.aipick` file or use `set` command**.
   Example `~/.aipick`:
   ```ini
    # General Settings
    logging=true
    temperature=1.0

    [OPENAI]
    # Model-Specific Settings
    key="<your-api-key>"
    temperature=0.8
    generate=2

    [OLLAMA]
    temperature=0.7
    model[]=llama3.1
    model[]=codestral
   ```

> The priority of settings is: **Command-line Arguments > Model-Specific Settings > General Settings > Default Values**.

## General Settings

The following settings can be applied to most models, but support may vary.
Please check the documentation for each specific model to confirm which settings are supported.

| Setting            | Description                          | Default  |
|--------------------|--------------------------------------|----------|
| `systemPrompt`     | System Prompt text                   | -        |
| `systemPromptPath` | Path to system prompt file           | -        |
| `timeout`          | Request timeout (milliseconds)       | 10000    |
| `temperature`      | Model's creativity (0.0 - 2.0)       | 0.7      |
| `maxTokens`        | Maximum number of tokens to generate | 1024     |
| `logging`          | Enable logging                       | true     |


##### systemPrompt
- Allow users to specify a custom system prompt

```sh
aipick config set systemPrompt="Your communication style is friendly, engaging, and informative."
```

> `systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.

##### systemPromptPath
- Allow users to specify a custom file path for their own system prompt template
- Please see [Custom Prompt Template](#custom-prompt-template)

```sh
aipick config set systemPromptPath="/path/to/user/prompt.txt"
```

##### timeout

The timeout for network requests in milliseconds.

Default: `10_000` (10 seconds)

```sh
aipick config set timeout=20000 # 20s
```

##### temperature

The temperature (0.0-2.0) is used to control the randomness of the output

Default: `0.7`

```sh
aipick config set temperature=0
```

##### maxTokens

The maximum number of tokens that the AI models can generate.

Default: `1024`

```sh
aipick config set maxTokens=3000
```

##### logging

Default: `true`

Option that allows users to decide whether to generate a log file capturing the responses.
The log files will be stored in the `~/.aipick_log` directory(user's home).

- You can remove all logs below comamnd.

```sh
aipick log removeAll 
```

## Model-Specific Settings

> Some models mentioned below are subject to change.

### OpenAI

| Setting            | Description                                                                                                      | Default                |
|--------------------|------------------------------------------------------------------------------------------------------------------|------------------------|
| `key`              | API key                                                                                                          | -                      |
| `model`            | Model to use                                                                                                     | `gpt-3.5-turbo`        |
| `url`              | API endpoint URL                                                                                                 | https://api.openai.com |
| `path`             | API path                                                                                                         | /v1/chat/completions   |
| `proxy`            | Proxy settings                                                                                                   | -                      |
| `generate`         | Number of responses to generate (1-5)                                                                            | 1                      |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                      |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                      |
| `timeout`          | Request timeout (milliseconds)                                                                                   | 10000                  |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7                    |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024                   |
| `logging`          | Enable logging                                                                                                   | true                   |

##### OPENAI.key

The OpenAI API key. You can retrieve it from [OpenAI API Keys page](https://platform.openai.com/account/api-keys).

```sh
aipick config set OPENAI.key="your api key"
```

##### OPENAI.model

Default: `gpt-3.5-turbo`

The Chat Completions (`/v1/chat/completions`) model to use. Consult the list of models available in the [OpenAI Documentation](https://platform.openai.com/docs/models/model-endpoint-compatibility).

> Tip: If you have access, try upgrading to [`gpt-4`](https://platform.openai.com/docs/models/gpt-4) for next-level code analysis. It can handle double the input size, but comes at a higher cost. Check out OpenAI's website to learn more.

```sh
aipick config set OPENAI.model=gpt-4
```

##### OPENAI.url

Default: `https://api.openai.com`

The OpenAI URL. Both https and http protocols supported. It allows to run local OpenAI-compatible server.

##### OPENAI.path

Default: `/v1/chat/completions`

The OpenAI Path.

### Ollama

| Setting            | Description                                                                                                      | Default                |
|--------------------|------------------------------------------------------------------------------------------------------------------|------------------------|
| `model`            | Model(s) to use (comma-separated list)                                                                           | -                      |
| `host`             | Ollama host URL                                                                                                  | http://localhost:11434 |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                      |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                      |
| `timeout`          | Request timeout (milliseconds)                                                                                   | 10000                  |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7                    |
| `logging`          | Enable logging                                                                                                   | true                   |

##### OLLAMA.model

The Ollama Model. Please see [a list of models available](https://ollama.com/library)

```sh
aipick config set OLLAMA_MODEL="llama3"
aipick config set OLLAMA_MODEL="llama3,codellama" # for multiple models

aipick config add OLLAMA.model="gemma2" # Only Ollama.model can be added.
```

> OLLAMA.model is only **string array** type to support multiple Ollama. Please see [this section](#loading-multiple-ollama-models).

##### OLLAMA.host

Default: `http://localhost:11434`

The Ollama host

```sh
aipick config set OLLAMA.host=<host>
```

##### OLLAMA.timeout

Default: `10_000` (10 seconds)

Request timeout for the Ollama.

```sh
aipick config set OLLAMA.timeout=<timeout>
```

### HuggingFace

| Setting            | Description                                                                                                      | Default                                |
|--------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `cookie`           | Authentication cookie                                                                                            | -                                      |
| `model`            | Model to use                                                                                                     | `CohereForAI/c4ai-command-r-plus`      |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                                      |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                                      |
| `logging`          | Enable logging                                                                                                   | true                                   |

##### HUGGINGFACE.cookie

The [Huggingface Chat](https://huggingface.co/chat/) Cookie. Please check [how to get cookie](https://github.com/tak-bro/aipick?tab=readme-ov-file#how-to-get-cookieunofficial-api)

aipick config set HUGGINGFACE.cookie="<your browser cookie>"

```sh
# Please be cautious of Escape characters(\", \') in browser cookie string
aipick config set HUGGINGFACE.cookie="your-cooke"
```

##### HUGGINGFACE.model

Default: `CohereForAI/c4ai-command-r-plus`

Supported:
- `CohereForAI/c4ai-command-r-plus`
- `meta-llama/Meta-Llama-3-70B-Instruct`
- `HuggingFaceH4/zephyr-orpo-141b-A35b-v0.1`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`
- `NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO`
- `01-ai/Yi-1.5-34B-Chat`
- `mistralai/Mistral-7B-Instruct-v0.2`
- `microsoft/Phi-3-mini-4k-instruct`

```sh
aipick config set HUGGINGFACE.model="mistralai/Mistral-7B-Instruct-v0.2"
```

### Gemini

| Setting            | Description                                                                                                      | Default                 |
|--------------------|------------------------------------------------------------------------------------------------------------------|-------------------------|
| `key`              | API key                                                                                                          | -                       |
| `model`            | Model to use                                                                                                     | `gemini-1.5-pro-latest` |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                       |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                       |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7                     |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024                    |
| `logging`          | Enable logging                                                                                                   | true                    |

##### GEMINI.key

The Gemini API key. If you don't have one, create a key in [Google AI Studio](https://aistudio.google.com/app/apikey).

```sh
aipick config set GEMINI.key="your api key"
```

##### GEMINI.model

Default: `gemini-1.5-pro-latest`

Supported:
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`

```sh
aipick config set GEMINI.model="gemini-1.5-flash-latest"
```

### Anthropic

| Setting            | Description                                                                                                      | Default                   |
|--------------------|------------------------------------------------------------------------------------------------------------------|---------------------------|
| `key`              | API key                                                                                                          | -                         |
| `model`            | Model to use                                                                                                     | `claude-3-haiku-20240307` |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                         |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                         |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7                       |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024                      |
| `logging`          | Enable logging                                                                                                   | true                      |

##### ANTHROPIC.key

The Anthropic API key. To get started with Anthropic Claude, request access to their API at [anthropic.com/earlyaccess](https://www.anthropic.com/earlyaccess).

##### ANTHROPIC.model

Default: `claude-3-haiku-20240307`

Supported:
- `claude-3-haiku-20240307`
- `claude-3-sonnet-20240229`
- `claude-3-opus-20240229`
- `claude-2.1`
- `claude-2.0`
- `claude-instant-1.2`

```sh
aipick config set ANTHROPIC.model=claude-instant-1.2
```

### Mistral

| Setting            | Description                                                                                                      | Default        |
|--------------------|------------------------------------------------------------------------------------------------------------------|----------------|
| `key`              | API key                                                                                                          | -              |
| `model`            | Model to use                                                                                                     | `mistral-tiny` |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -              |
| `systemPromptPath` | Path to system prompt file                                                                                       | -              |
| `timeout`          | Request timeout (milliseconds)                                                                                   | 10000          |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7            |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024           |
| `logging`          | Enable logging                                                                                                   | true           |

##### MISTRAL.key

The Mistral API key. If you don't have one, please sign up and subscribe in [Mistral Console](https://console.mistral.ai/).

##### MISTRAL.model

Default: `mistral-tiny`

Supported:
- `open-mistral-7b`
- `mistral-tiny-2312`
- `mistral-tiny`
- `open-mixtral-8x7b`
- `mistral-small-2312`
- `mistral-small`
- `mistral-small-2402`
- `mistral-small-latest`
- `mistral-medium-latest`
- `mistral-medium-2312`
- `mistral-medium`
- `mistral-large-latest`
- `mistral-large-2402`
- `mistral-embed`

### Codestral

| Setting            | Description                                                                                                      | Default            |
|--------------------|------------------------------------------------------------------------------------------------------------------|--------------------|
| `key`              | API key                                                                                                          | -                  |
| `model`            | Model to use                                                                                                     | `codestral-latest` |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                  |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                  |
| `timeout`          | Request timeout (milliseconds)                                                                                   | 10000              |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7                |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024               |
| `logging`          | Enable logging                                                                                                   | true               |

##### CODESTRAL.key

The Codestral API key. If you don't have one, please sign up and subscribe in [Mistral Console](https://console.mistral.ai/codestral).

##### CODESTRAL.model

Default: `codestral-latest`

Supported:
- `codestral-latest`
- `codestral-2405`

```sh
aipick config set CODESTRAL.model="codestral-2405"
```

#### Cohere

| Setting            | Description                                                                                                      | Default           |
|--------------------|------------------------------------------------------------------------------------------------------------------|-------------------|
| `key`              | API key                                                                                                          | -                 |
| `model`            | Model to use                                                                                                     | `command-r-plus`  |
| `generate`         | Number of responses to generate (1-5)                                                                            | 1                 |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -                 |
| `systemPromptPath` | Path to system prompt file                                                                                       | -                 |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7               |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024              |
| `logging`          | Enable logging                                                                                                   | true              |


##### COHERE.key

The Cohere API key. If you don't have one, please sign up and get the API key in [Cohere Dashboard](https://dashboard.cohere.com/).

##### COHERE.model

Default: `command`

Supported models:
- `command-r-plus`
- `command-r`
- `command`
- `command-nightly`
- `command-light`
- `command-light-nightly`

```sh
aipick config set COHERE.model="command-r"
```

### Groq

| Setting            | Description                                                                                                      | Default       |
|--------------------|------------------------------------------------------------------------------------------------------------------|---------------|
| `key`              | API key                                                                                                          | -             |
| `model`            | Model to use                                                                                                     | `gemma-7b-it` |
| `systemPrompt`     | System Prompt text(`systemPrompt` takes precedence over `SystemPromptPath` and does not apply at the same time.) | -             |
| `systemPromptPath` | Path to system prompt file                                                                                       | -             |
| `timeout`          | Request timeout (milliseconds)                                                                                   | 10000         |
| `temperature`      | Model's creativity (0.0 - 2.0)                                                                                   | 0.7           |
| `maxTokens`        | Maximum number of tokens to generate                                                                             | 1024          |
| `logging`          | Enable logging                                                                                                   | true          |

##### GROQ.key

The Groq API key. If you don't have one, please sign up and get the API key in [Groq Console](https://console.groq.com).

##### GROQ.model

Default: `gemma-7b-it`

Supported:
- `llama3-8b-8192`
- `llama3-70b-8192`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

```sh
aipick config set GROQ.model="llama3-8b-8192"
```

## Upgrading

Check the installed version with:

```
aipick --version
```

If it's not the [latest version](https://github.com/tak-bro/aipick/releases/latest), run:

```sh
npm update -g aipick
```

## Custom Prompt Template

_aipick_ supports custom prompt templates through the `systemPromptPath` option. This feature allows you to define your own system prompt structure, giving you more control over the AI response generation process.

#### Using the promptPath Option
To use a custom prompt template, specify the path to your template file when running the tool:

```
aipick config set systemPromptPath="/path/to/user/prompt.txt"
```

#### Example Template

Here's an example of how your custom system template might look:

```
You are a Software Development Tutor.
Your mission is to guide users from zero knowledge to understanding the fundamentals of software.
Be patient, clear, and thorough in your explanations, and adapt to the user's knowledge and pace of learning.
```

> NOTE
> - For the `systemPromptPath` option, set the **template path**, not the template content.
> - If you want to set the template content, use [`systemPrompt`](#systemprompt) option

## Loading Multiple Ollama Models

You can load and make simultaneous requests to multiple models using Ollama's experimental feature, the `OLLAMA_MAX_LOADED_MODELS` option.
- `OLLAMA_MAX_LOADED_MODELS`: Load multiple models simultaneously

#### Setup Guide

Follow these steps to set up and utilize multiple models simultaneously:

##### 1. Running Ollama Server

First, launch the Ollama server with the `OLLAMA_MAX_LOADED_MODELS` environment variable set. This variable specifies the maximum number of models to be loaded simultaneously. 
For example, to load up to 3 models, use the following command:

```shell
OLLAMA_MAX_LOADED_MODELS=3 ollama serve
```
> Refer to [configuration](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server) for detailed instructions.

##### 2. Configuring _aipick_

Next, set up _aipick_ to specify multiple models. You can assign a list of models, separated by **commas(`,`)**, to the **OLLAMA.model** environment variable. Here's how you do it:

```shell
aipick config set OLLAMA.model="mistral,llama3.1"
# or 
aipick config add OLLAMA.model="mistral"
aipick config add OLLAMA.model="llama3.1"
```

With this command, _aipick_ is instructed to utilize both the "mistral" and "llama3.1" models when making requests to the Ollama server.

##### 3. Run _aipick_

```shell
aipick
```

> Note that this feature is available starting from Ollama version [**0.1.33**](https://github.com/ollama/ollama/releases/tag/v0.1.33).

## How to get Cookie(**Unofficial API**)

* Login to the site you want
* You can get cookie from the browser's developer tools network tab
* See for any requests check out the Cookie, **Copy whole value**
* Check below image for the format of cookie

> When setting cookies with long string values, ensure to **escape characters** like ", ', and others properly.
> - For double quotes ("), use \\"
> - For single quotes ('), use \\'

![how-to-get-cookie](https://github.com/tak-bro/aipick/blob/main/img/cookie-huggingface.png?raw=true)

## Disclaimer and Risks

This project uses functionalities from external APIs but is not officially affiliated with or endorsed by their providers. Users are responsible for complying with API terms, rate limits, and policies.

## Contributing

For bug fixes or feature implementations, please check the [Contribution Guide](CONTRIBUTING.md).

---

If this project has been helpful, please consider giving it a Star ⭐️!

Maintainer: [@tak-bro](https://env-tak.github.io/)
