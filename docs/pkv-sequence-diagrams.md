# Personal Knowledge Vault - UX Sequence Diagrams

이 문서는 유스케이스별 UX 흐름을 명확히 하려는 목적입니다. 사용자 입력부터 결과 응답까지의 상호작용만 간결히 담아, 이후 구현 시 빠르게 참조할 수 있도록 구성했습니다.

아래 시퀀스 다이어그램은 UI/UX 관점에서 각 유스케이스의 상호작용 흐름을 보여줍니다. 다이어그램 자체는 Mermaid로 유지하고, 설명은 한국어로 작성했습니다.

## UC1) Notion export import and classification

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant WebUI as Web UI
  participant API as API
  participant Worker as Processor/Worker
  participant Classifier as ClassifierProvider (stub)
  participant Vault as Vault FS
  participant Indexer as Indexer
  participant Log as Run Log

  User->>WebUI: Upload Notion export
  WebUI->>API: POST /imports (file)
  API->>API: Validate payload
  API->>Log: Create run log (status=queued)
  API-->>WebUI: 202 Accepted (runId)

  API->>Worker: Enqueue import job (runId)
  Worker->>Log: Update run log (status=processing)
  Worker->>Worker: Normalize -> Document
  Worker->>Classifier: Classify (doc)
  alt classification success
    Classifier-->>Worker: type/folder/tags
    Worker->>Vault: Write Markdown + YAML frontmatter
  else classification failure
    Classifier-->>Worker: error
    Worker->>Vault: Write to fallback folder (Uncategorized)
    Worker->>Log: Append error details
  end
  Worker->>Indexer: Update index.json
  Worker->>Log: Update run log (status=done)

  WebUI->>API: GET /imports/{runId}
  API-->>WebUI: 200 OK (status, noteId, path)
```

## UC2) Web note creation and auto-classification

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant WebUI as Web UI
  participant API as API
  participant Worker as Processor/Worker
  participant Classifier as ClassifierProvider (stub)
  participant Vault as Vault FS
  participant Indexer as Indexer
  participant Log as Run Log

  User->>WebUI: Write note and submit
  WebUI->>API: POST /notes (content)
  API->>API: Validate payload
  alt validation failure
    API->>Log: Create run log (status=failed)
    API-->>WebUI: 400 Bad Request (error)
  else valid
    API->>Log: Create run log (status=queued)
    API-->>WebUI: 202 Accepted (runId)
    API->>Worker: Enqueue classify job (runId)
    Worker->>Log: Update run log (status=processing)
    Worker->>Classifier: Classify (note)
    alt classification success
      Classifier-->>Worker: type/folder/tags
      Worker->>Vault: Write Markdown + YAML frontmatter
    else classification failure
      Classifier-->>Worker: error
      Worker->>Vault: Write to fallback folder (Uncategorized)
      Worker->>Log: Append error details
    end
    Worker->>Indexer: Update index.json
    Worker->>Log: Update run log (status=done)
    WebUI->>API: GET /notes/{runId}
    API-->>WebUI: 200 OK (status, noteId, path)
  end
```

## UC3) YouTube URL submission and classification

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant WebUI as Web UI
  participant API as API
  participant Worker as Processor/Worker
  participant Classifier as ClassifierProvider (stub)
  participant Vault as Vault FS
  participant Indexer as Indexer
  participant Log as Run Log

  User->>WebUI: Submit YouTube URL
  WebUI->>API: POST /links (url)
  API->>API: Validate URL
  alt validation failure
    API->>Log: Create run log (status=failed)
    API-->>WebUI: 400 Bad Request (error)
  else valid
    API->>Log: Create run log (status=queued)
    API-->>WebUI: 202 Accepted (runId)
    API->>Worker: Enqueue link job (runId)
    Worker->>Log: Update run log (status=processing)
    Worker->>Classifier: Classify (url metadata stub)
    alt classification success
      Classifier-->>Worker: type/folder/tags
      Worker->>Vault: Write Markdown entry (URL)
    else classification failure
      Classifier-->>Worker: error
      Worker->>Vault: Write to fallback folder (Uncategorized)
      Worker->>Log: Append error details
    end
    Worker->>Indexer: Update index.json
    Worker->>Log: Update run log (status=done)
    WebUI->>API: GET /links/{runId}
    API-->>WebUI: 200 OK (status, noteId, path)
  end
```

## Idempotency & Retry Notes

- 각 요청은 `runId`를 기준으로 로그에 기록하고, 동일한 `idempotencyKey`가 있으면 동일 작업을 재실행하지 않도록 설계합니다.
- Processor/Worker는 각 단계별 완료 상태를 Run Log에 기록해, 실패 시 특정 단계부터 재시작할 수 있습니다.
- 분류 실패 시에는 `Uncategorized` 폴더로 저장하여 데이터 유실을 방지하고, 이후 재분류 워크플로우로 복구합니다.
- UI는 `GET /{resource}/{runId}` 폴링으로 상태를 확인하며, 재시도는 동일 `runId` 또는 새 `runId`로 구분합니다.
