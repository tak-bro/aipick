<div align="center">
  <div>
    <img src="https://github.com/tak-bro/aipick/blob/main/img/demo_body_min.gif?raw=true" alt="AIPick"/>
    <h1 align="center">AIPick</h1>
  </div>
  <p>
    An interactive CLI tool that leverages Ollama, ChatGPT, Gemini, Claude, Mistral and other AI.
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

_aipick_ is an interactive CLI tool that leverages multiple AI models.

## Key Features

- **Multi-AI Support**: Integrates with OpenAI, Anthropic Claude, Google Gemini, Mistral AI, Cohere, Groq, Huggingface
- **Local Model Support**: Use local AI models via Ollama.
- **Reactive CLI**: Enables simultaneous requests to multiple AIs and selection of the best AI response.
- **Custom Prompts**: Supports user-defined prompt templates.

## Supported Providers

### Remote

- [OpenAI](https://openai.com/)
- [Anthropic Claude](https://console.anthropic.com/)
- [Gemini](https://gemini.google.com/)
- [Mistral AI](https://mistral.ai/)
    - [Codestral **(Free till August 1, 2024)**](https://mistral.ai/news/codestral/)
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

2. Retrieve and set API keys or Cookie you intend to use:

It is not necessary to set all keys. **But at least one key must be set up.**

- [OpenAI](https://platform.openai.com/account/api-keys)
```sh
aipick config set OPENAI_KEY=<your key>
```

- [Anthropic Claude](https://console.anthropic.com/)
```sh
aipick config set ANTHROPIC_KEY=<your key>
```

- [Gemini](https://aistudio.google.com/app/apikey)
```sh
aipick config set GEMINI_KEY=<your key>
```

- [Mistral AI](https://console.mistral.ai/)
```sh
aipick config set MISTRAL_KEY=<your key>
```

- [Codestral](https://console.mistral.ai/)
```sh
aipick config set CODESTRAL_KEY=<your key>
```

- [Cohere](https://dashboard.cohere.com/)
```sh
aipick config set COHERE_KEY=<your key>
```

- [Groq](https://console.groq.com)
```sh
aipick config set GROQ_KEY=<your key>
```

- [Huggingface **(Unofficial)**](https://github.com/tak-bro/aipick?tab=readme-ov-file#how-to-get-cookieunofficial-api)
```shell
# Please be cautious of Escape characters(\", \') in browser cookie string 
aipick config set HUGGINGFACE_COOKIE="<your browser cookie>"
```

This will create a `.aipick` file in your home directory.

> You may need to create an account and set up billing.

3. Run aipick with your staged files in git repository:
```shell
git add <files...>
aipick
```

## Using Locally

You can also use your model for free with [Ollama](https://ollama.com/) and it is available to use both Ollama and remote providers **simultaneously**.

1. Install Ollama from [https://ollama.com](https://ollama.com/)

2. Start it with your model

```shell
ollama run llama3 # model you want use. ex) codellama, deepseek-coder
```

3. Set the model and host

```sh
aipick config set OLLAMA_MODEL=<your model>
```

> If you want to use ollama, you must set **OLLAMA_MODEL**.

4. Run _aipick_ with your staged in git repository
```shell
git add <files...>
aipick
```

> 👉 **Tip:** Ollama can run LLMs **in parallel** from v0.1.33. Please see [this section](#loading-multiple-ollama-models).

## How it works

This CLI tool runs `git diff` to grab all your latest code changes, sends them to configured AI, then returns the AI generated commit message.

> If the diff becomes too large, AI will not function properly. If you encounter an error saying the message is too long or it's not a valid commit message, **try reducing the commit unit**.

## Usage

### CLI mode

You can call `aipick` directly to generate a commit message for your staged changes:

```sh
git add <files...>
aipick
```

`aipick` passes down unknown flags to `git commit`, so you can pass in [`commit` flags](https://git-scm.com/docs/git-commit).

For example, you can stage all changes in tracked files with as you commit:

```sh
aipick --all # or -a
```

> 👉 **Tip:** Use the `aip` alias if `aipick` is too long for you.

#### CLI Options

##### `--locale` or `-l`
- Locale to use for the generated commit messages (default: **en**)

```sh
aipick --locale <s> # or -l <s>
```

##### `--generate` or `-g`
- Number of messages to generate (Warning: generating multiple costs more) (default: **1**)
- Sometimes the recommended commit message isn't the best so you want it to generate a few to pick from. You can generate multiple commit messages at once by passing in the `--generate <i>` flag, where 'i' is the number of generated messages:

```sh
aipick --generate <i> # or -g <i>
```

> Warning: this uses more tokens, meaning it costs more.

##### `--all` or `-a`
- Automatically stage changes in tracked files for the commit (default: **false**)

```sh
aipick --all # or -a
```

##### `--type` or `-t`
- Automatically stage changes in tracked files for the commit (default: **conventional**)
- it supports [`conventional`](https://conventionalcommits.org/) and [`gitmoji`](https://gitmoji.dev/)

```sh
aipick --type conventional # or -t conventional
aipick --type gitmoji # or -t gitmoji
```

##### `--confirm` or `-y`
- Skip confirmation when committing after message generation (default: **false**)

```sh
aipick --confirm # or -y
```

##### `--clipboard` or `-c`
- Copy the selected message to the clipboard (default: **false**)
- This is a useful option when you don't want to commit through _aipick_.
- If you give this option, _aipick_ will not commit.

```sh
aipick --clipboard # or -c
```

##### `--promptPath` or `-p`
- Allow users to specify a custom file path for their own prompt template
- Enable users to define and use their own prompts instead of relying solely on the default prompt
- Please see [Custom Prompt Template](#custom-prompt-template)

```sh
aipick --promptPath <s> # or -p <s>
```

### Git hook

You can also integrate _aipick_ with Git via the [`prepare-commit-msg`](https://git-scm.com/docs/githooks#_prepare_commit_msg) hook. This lets you use Git like you normally would, and edit the commit message before committing.

#### Install

In the Git repository you want to install the hook in:

```sh
aipick hook install
```

#### Uninstall

In the Git repository you want to uninstall the hook from:

```sh
aipick hook uninstall
```

#### Usage

1. Stage your files and commit:

```sh
git add <files...>
git commit # Only generates a message when it's not passed in
```

> If you ever want to write your own message instead of generating one, you can simply pass one in: `git commit -m "My message"`

2. _aipick_ will generate the commit message for you and pass it back to Git. Git will open it with the [configured editor](https://docs.github.com/en/get-started/getting-started-with-git/associating-text-editors-with-git) for you to review/edit it.

3. Save and close the editor to commit!

## Configuration

### Reading a configuration value

To retrieve a configuration option, use the command:

```sh
aipick config get <key>
```

For example, to retrieve the API key, you can use:

```sh
aipick config get OPENAI_KEY
```

You can also retrieve multiple configuration options at once by separating them with spaces:

```sh
aipick config get OPENAI_KEY OPENAI_MODEL GEMINI_KEY 
```

### Setting a configuration value

To set a configuration option, use the command:

```sh
aipick config set <key>=<value>
```

For example, to set the API key, you can use:

```sh
aipick config set OPENAI_KEY=<your-api-key>
```

You can also set multiple configuration options at once by separating them with spaces, like

```sh
aipick config set OPENAI_KEY=<your-api-key> generate=3 locale=en
```

## Options

| Option               | Default                                | Description                                                                                                                        |
|----------------------|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `OPENAI_KEY`         | N/A                                    | The OpenAI API key                                                                                                                 |
| `OPENAI_MODEL`       | `gpt-3.5-turbo`                        | The OpenAI Model to use                                                                                                            |
| `OPENAI_URL`         | `https://api.openai.com`               | The OpenAI URL                                                                                                                     |
| `OPENAI_PATH`        | `/v1/chat/completions`                 | The OpenAI request pathname                                                                                                        |
| `ANTHROPIC_KEY`      | N/A                                    | The Anthropic API key                                                                                                              |
| `ANTHROPIC_MODEL`    | `claude-3-haiku-20240307`              | The Anthropic Model to use                                                                                                         |
| `GEMINI_KEY`         | N/A                                    | The Gemini API key                                                                                                                 |
| `GEMINI_MODEL`       | `gemini-1.5-pro-latest`                | The Gemini Model                                                                                                                   |
| `MISTRAL_KEY`        | N/A                                    | The Mistral API key                                                                                                                |
| `MISTRAL_MODEL`      | `mistral-tiny`                         | The Mistral Model to use                                                                                                           |
| `CODESTRAL_KEY`      | N/A                                    | The Codestral API key                                                                                                              |  
| `CODESTRAL_MODEL`    | `codestral-latest`                     | The Codestral Model to use                                                                                                         |
| `COHERE_KEY`         | N/A                                    | The Cohere API Key                                                                                                                 |
| `COHERE_MODEL`       | `command`                              | The identifier of the Cohere model                                                                                                 |
| `GROQ_KEY`           | N/A                                    | The Groq API Key                                                                                                                   |
| `GROQ_MODEL`         | `gemma-7b-it`                          | The Groq model name to use                                                                                                         |
| `HUGGINGFACE_COOKIE` | N/A                                    | The HuggingFace Cookie string                                                                                                      |
| `HUGGINGFACE_MODEL`  | `mistralai/Mixtral-8x7B-Instruct-v0.1` | The HuggingFace Model to use                                                                                                       |
| `OLLAMA_MODEL`       | N/A                                    | The Ollama Model. It should be downloaded your local                                                                               |
| `OLLAMA_HOST`        | `http://localhost:11434`               | The Ollama Host                                                                                                                    |
| `OLLAMA_TIMEOUT`     | `100_000` ms                           | Request timeout for the Ollama                                                                                                     |
| `locale`             | `en`                                   | Locale for the generated commit messages                                                                                           |
| `generate`           | `1`                                    | Number of commit messages to generate                                                                                              |
| `type`               | `conventional`                         | Type of commit message to generate                                                                                                 |
| `proxy`              | N/A                                    | Set a HTTP/HTTPS proxy to use for requests(only **OpenAI**)                                                                        |
| `timeout`            | `10_000` ms                            | Network request timeout                                                                                                            |
| `max-length`         | `50`                                   | Maximum character length of the generated commit message(Subject)                                                                  |
| `max-tokens`         | `1024`                                 | The maximum number of tokens that the AI models can generate (for **Open AI, Anthropic, Gemini, Mistral, Codestral**)              |
| `temperature`        | `0.7`                                  | The temperature (0.0-2.0) is used to control the randomness of the output (for **Open AI, Anthropic, Gemini, Mistral, Codestral**) |
| `promptPath`         | N/A                                    | Allow users to specify a custom file path for their own prompt template                                                            |
| `logging`            | `false`                                | Whether to log AI responses for debugging (true or false)                                                                          |
| `ignoreBody`         | `false`                                | Whether the commit message includes body (true or false)                                                                           |

> **Currently, options are set universally. However, there are plans to develop the ability to set individual options in the future.**

### Available Options by Model
|                      | locale | generate | type  | proxy |        timeout         | max-length  | max-tokens | temperature | prompt |
|:--------------------:|:------:|:--------:|:-----:|:-----:|:----------------------:|:-----------:|:----------:|:-----------:|:------:|
|      **OpenAI**      |   ✓    |    ✓     |   ✓   |   ✓   |           ✓            |      ✓      |     ✓      |      ✓      |   ✓    |
| **Anthropic Claude** |   ✓    |    ✓     |   ✓   |       |                        |      ✓      |     ✓      |      ✓      |   ✓    |
|      **Gemini**      |   ✓    |    ✓     |   ✓   |       |                        |      ✓      |     ✓      |      ✓      |   ✓    |
|    **Mistral AI**    |   ✓    |    ✓     |   ✓   |       |           ✓            |      ✓      |     ✓      |      ✓      |   ✓    |
|    **Codestral**     |   ✓    |    ✓     |   ✓   |       |           ✓            |      ✓      |     ✓      |      ✓      |   ✓    |
|      **Cohere**      |   ✓    |    ✓     |   ✓   |       |                        |      ✓      |     ✓      |      ✓      |   ✓    |
|       **Groq**       |   ✓    |    ✓     |   ✓   |       |           ✓            |      ✓      |            |             |   ✓    |
|   **Huggingface**    |   ✓    |    ✓     |   ✓   |       |                        |      ✓      |            |             |   ✓    |
|      **Ollama**      |   ✓    |    ✓     |   ✓   |       | ⚠<br/>(OLLAMA_TIMEOUT) |      ✓      |            |      ✓      |   ✓    |


### Common Options

##### locale

Default: `en`

The locale to use for the generated commit messages. Consult the list of codes in: https://wikipedia.org/wiki/List_of_ISO_639_language_codes.

##### generate

Default: `1`

The number of commit messages to generate to pick from.

Note, this will use more tokens as it generates more results.

##### proxy

Set a HTTP/HTTPS proxy to use for requests.

To clear the proxy option, you can use the command (note the empty value after the equals sign):

> **Only supported within the OpenAI**

```sh
aipick config set proxy=
```

##### timeout

The timeout for network requests to the OpenAI API in milliseconds.

Default: `10_000` (10 seconds)

```sh
aipick config set timeout=20000 # 20s
```

##### max-length

The maximum character length of the generated commit message.

Default: `50`

```sh
aipick config set max-length=100
```

##### type

Default: `conventional`

Supported: `conventional`, `gitmoji`

The type of commit message to generate. Set this to "conventional" to generate commit messages that follow the Conventional Commits specification:

```sh
aipick config set type=conventional
```

You can clear this option by setting it to an empty string:

```sh
aipick config set type=
```

##### max-tokens
The maximum number of tokens that the AI models can generate.

Default: `1024`

```sh
aipick config set max-tokens=3000
```

##### temperature
The temperature (0.0-2.0) is used to control the randomness of the output

Default: `0.7`

```sh
aipick config set temperature=0
```

##### promptPath
- Allow users to specify a custom file path for their own prompt template
- Enable users to define and use their own prompts instead of relying solely on the default prompt
- Please see [Custom Prompt Template](#custom-prompt-template)

```sh
aipick config set promptPath="/path/to/user/prompt.txt"
```

##### logging

Default: `false`

Option that allows users to decide whether to generate a log file capturing the responses.
The log files will be stored in the `~/.aipick_log` directory(user's home).

![log-path](https://github.com/tak-bro/aipick/blob/main/img/log_path.png?raw=true)

```sh
aipick config set logging="true"
```

- You can remove all logs below comamnd.
 
```sh
aipick log removeAll 
```

##### ignoreBody

Default: `false`

This option determines whether the commit message includes body. If you don't want to include body in message, you can set it to `true`.

```sh
aipick config set ignoreBody="true"
```

![ignore_body_true](https://github.com/tak-bro/aipick/blob/main/img/ignore_body_true.png?raw=true)


```sh
aipick config set ignoreBody="false"
```

![ignore_body_false](https://github.com/tak-bro/aipick/blob/main/img/ignore_body_false.png?raw=true)


### Ollama

##### OLLAMA_MODEL

The Ollama Model. Please see [a list of models available](https://ollama.com/library)

```sh
aipick config set OLLAMA_MODEL="llama3"
aipick config set OLLAMA_MODEL="llama3,codellama" # for multiple models
```

##### OLLAMA_HOST

Default: `http://localhost:11434`

The Ollama host

```sh
aipick config set OLLAMA_HOST=<host>
```

##### OLLAMA_TIMEOUT

Default: `100_000` (100 seconds)

Request timeout for the Ollama. Default OLLAMA_TIMEOUT is **100 seconds** because it can take a long time to run locally.

```sh
aipick config set OLLAMA_TIMEOUT=<timout>
```

### OPEN AI

##### OPENAI_KEY

The OpenAI API key. You can retrieve it from [OpenAI API Keys page](https://platform.openai.com/account/api-keys).

##### OPENAI_MODEL

Default: `gpt-3.5-turbo`

The Chat Completions (`/v1/chat/completions`) model to use. Consult the list of models available in the [OpenAI Documentation](https://platform.openai.com/docs/models/model-endpoint-compatibility).

> Tip: If you have access, try upgrading to [`gpt-4`](https://platform.openai.com/docs/models/gpt-4) for next-level code analysis. It can handle double the input size, but comes at a higher cost. Check out OpenAI's website to learn more.

```sh
aipick config set OPENAI_MODEL=gpt-4
```

##### OPENAI_URL

Default: `https://api.openai.com`

The OpenAI URL. Both https and http protocols supported. It allows to run local OpenAI-compatible server.

##### OPENAI_PATH

Default: `/v1/chat/completions`

The OpenAI Path.

### Anthropic Claude

##### ANTHROPIC_KEY

The Anthropic API key. To get started with Anthropic Claude, request access to their API at [anthropic.com/earlyaccess](https://www.anthropic.com/earlyaccess).

##### ANTHROPIC_MODEL

Default: `claude-3-haiku-20240307`

Supported:
- `claude-3-haiku-20240307`
- `claude-3-sonnet-20240229`
- `claude-3-opus-20240229`
- `claude-2.1`
- `claude-2.0`
- `claude-instant-1.2`

```sh
aipick config set ANTHROPIC_MODEL=claude-instant-1.2
```

### GEMINI

##### GEMINI_KEY

The Gemini API key. If you don't have one, create a key in [Google AI Studio](https://aistudio.google.com/app/apikey).

##### GEMINI_MODEL

Default: `gemini-1.5-pro-latest`

Supported:
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`

> The models mentioned above are subject to change.

### MISTRAL

##### MISTRAL_KEY

The Mistral API key. If you don't have one, please sign up and subscribe in [Mistral Console](https://console.mistral.ai/).

##### MISTRAL_MODEL

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

> The models mentioned above are subject to change.

### CODESTRAL

##### CODESTRAL_KEY

The Codestral API key. If you don't have one, please sign up and subscribe in [Mistral Console](https://console.mistral.ai/codestral).

##### CODESTRAL_MODEL

Default: `codestral-latest`

Supported:
- `codestral-latest`
- `codestral-2405`

> The models mentioned above are subject to change.

### Cohere

##### COHERE_KEY

The Cohere API key. If you don't have one, please sign up and get the API key in [Cohere Dashboard](https://dashboard.cohere.com/).

##### COHERE_MODEL

Default: `command`

Supported:
- `command`
- `command-nightly`
- `command-light`
- `command-light-nightly`

> The models mentioned above are subject to change.

### Groq

##### GROQ_KEY

The Groq API key. If you don't have one, please sign up and get the API key in [Groq Console](https://console.groq.com).

##### GROQ_MODEL

Default: `gemma-7b-it`

Supported:
- `llama3-8b-8192`
- 'llama3-70b-8192'
- `mixtral-8x7b-32768`
- `gemma-7b-it`

> The models mentioned above are subject to change.

### HuggingFace Chat

##### HUGGINGFACE_COOKIE

The [Huggingface Chat](https://huggingface.co/chat/) Cookie. Please check [how to get cookie](https://github.com/tak-bro/aipick?tab=readme-ov-file#how-to-get-cookieunofficial-api)

##### HUGGINGFACE_MODEL

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

> The models mentioned above are subject to change.

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

_aipick_ supports custom prompt templates through the `promptPath` option. This feature allows you to define your own prompt structure, giving you more control over the commit message generation process.

### Using the promptPath Option
To use a custom prompt template, specify the path to your template file when running the tool:
```
aipick config set promptPath="/path/to/user/prompt.txt"
```

### Template Format

Your custom template can include placeholders for various commit options.
Use curly braces `{}` to denote these placeholders for options. The following placeholders are supported:

- [{locale}](#locale): The language for the commit message (string)
- [{maxLength}](#max-length): The maximum length for the commit message (number)
- [{type}](#type): The type of the commit (conventional or gitmoji)
- [{generate}](#generate): The number of commit messages to generate (number)

### Example Template

Here's an example of how your custom template might look:

```
Generate a {type} commit message in {locale}.
The message should not exceed {maxLength} characters.
Please provide {generate} messages.

Remember to follow these guidelines:
1. Use the imperative mood
2. Be concise and clear
3. Explain the 'why' behind the change
```

#### Appended Text

Please note that the following text will always be appended to the end of your custom prompt:

```
Provide your response as a JSON array where each element is an object with "subject", "body", and "footer" keys.
The "subject" should include the type, optional scope, and description . If there's no body or footer, use an empty string for those fields.
Example response format:
[
  {
    "subject": "string",
    "body": "string",
    "footer": "string"
  },
  ...
]
```

This ensures that the output is consistently formatted as a JSON array, regardless of the custom template used.

### Notes

If the specified file cannot be read or parsed, _aipick_ will fall back to using the default prompt generation logic.
Ensure your template includes all necessary instructions for generating appropriate commit messages.
You can still use all other command-line options in conjunction with `promptPath`.

By using custom templates, you can tailor the commit message generation to your team's specific needs or coding standards.

> NOTE: For the `promptPath` option, set the **template path**, not the template content

## Loading Multiple Ollama Models

<img src="https://github.com/tak-bro/aipick/blob/main/img/ollama_parallel.gif?raw=true" alt="OLLAMA_PARALLEL" />

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

Next, set up _aipick_ to specify multiple models. You can assign a list of models, separated by **commas(`,`)**, to the OLLAMA_MODEL environment variable. Here's how you do it:

```shell
aipick config set OLLAMA_MODEL="mistral,dolphin-llama3"
```

With this command, _aipick_ is instructed to utilize both the "mistral" and "dolphin-llama3" models when making requests to the Ollama server.

##### 3. Run _aipick_

```shell
aipick
```

> Note that this feature is available starting from Ollama version [**0.1.33**](https://github.com/ollama/ollama/releases/tag/v0.1.33) and _aipick_ version [**1.9.5**](https://www.npmjs.com/package/aipick/v/1.9.5).


## How to get Cookie(**Unofficial API**)

* Login to the site you want
* You can get cookie from the browser's developer tools network tab
* See for any requests check out the Cookie, **Copy whole value**
* Check below image for the format of cookie

> When setting cookies with long string values, ensure to **escape characters** like ", ', and others properly.
> - For double quotes ("), use \\"
> - For single quotes ('), use \\'

![how-to-get-cookie](https://github.com/tak-bro/aipick/assets/7614353/66f2994d-23d9-4c88-a113-f2d3dc5c0669)

## Disclaimer

This project utilizes certain functionalities or data from external APIs, but it is important to note that it is not officially affiliated with or endorsed by the providers of those APIs. The use of external APIs is at the sole discretion and risk of the user.

## Risk Acknowledgment

Users are responsible for understanding and abiding by the terms of use, rate limits, and policies set forth by the respective API providers. The project maintainers cannot be held responsible for any misuse, downtime, or issues arising from the use of the external APIs.

It is recommended that users thoroughly review the API documentation and adhere to best practices to ensure a positive and compliant experience.

## Please Star ⭐️
If this project has been helpful to you, I would greatly appreciate it if you could click the Star⭐️ button on this repository!

## Maintainers

- [@tak-bro](https://env-tak.github.io/)

## Contributing

If you want to help fix a bug or implement a feature in [Issues](https://github.com/tak-bro/aipick/issues), checkout the [Contribution Guide](CONTRIBUTING.md) to learn how to setup and test the project.
