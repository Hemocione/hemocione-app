# Release Follow-ups

Itens de débito técnico identificados durante releases que ficaram para o próximo ciclo. Sempre que abrir um novo bump de versão, dá uma checada aqui antes pra varrer o que dá pra resolver junto.

## Como gerar um release

- **Android:** crie `android/keystore.properties` (gitignored; `storeFile=../hemocione.keystore`, `storePassword`, `keyAlias`, `keyPassword`) e rode `scripts/release-android.sh`. Envie o `app-release.aab` no Play Console.
- **iOS:** no macOS, com o Xcode logado no time `JGY96PPKZK`, rode `scripts/release-ios.sh`. O script faz o archive e o upload para o App Store Connect via `ios/App/ExportOptions.plist`.

## Pendentes

- **App Store "Privacidade do app":** declarar Localização (aproximada e precisa, funcionalidade do app), igual ao que o Play já declara desde a 0.3.0.
- **Play "Status da política":** alerta "segmentar API 36" (aplicado em 2026-08-30). A produção já usa API 36; confira se alguma faixa de teste ainda tem um build antigo e desative.

## Histórico

### v0.3.0 — 2026-10-21

- **Conteúdo:** Hemárcio (avatar gamificado), Conquistas, menus Jogos, Instituições e Ajuda Aí, permissão de localização. Notas em `docs/release-notes/0.3.0.md`.
- **Follow-ups resolvidos:** `NSLocationWhenInUseUsageDescription` (entrou antes, com a localização dos embeds); `ITSAppUsesNonExemptEncryption=false`; `signingConfig` lendo `android/keystore.properties`.
- **Status:** enviada para revisão em 2026-10-21 nas duas lojas. Play: versionCode 6, lançamento 100%, publicação gerenciada desativada. App Store: build 3, lançamento automático após aprovação.
- **Play "Segurança dos dados":** Localização aproximada e precisa declaradas (coletadas, não compartilhadas, opcionais, funcionalidade do app).
- **versionCode 5 queimado:** o Play acusou 7 aparelhos sem GPS. O fix (`uses-feature ... required=false`) exigiu novo upload, e um versionCode enviado não volta a ser aceito.

### v0.2.1 — 2026-05-09

- **Conteúdo:** upgrade Capacitor 7 → 8; remoção temporária do item "Vestir a Camisa" do menu lateral.
- **Status:** submetida para review nas duas stores (Play Console production + App Store Connect, manual release).
- **Caveats observados durante o release:**
  - ⚠️ ITMS-90683 (location usage description) — vide item 1.
  - ⚠️ Pergunta de export compliance respondida manualmente no App Store Connect — vide item 2.
  - ⚠️ Build Android via GUI — vide item 3.
  - 🛠️ Cap 8 exige JDK 21+. Local default é 1.8; usado `JAVA_HOME=/opt/homebrew/opt/openjdk@23` ad hoc para o build Android.
  - 🛠️ Xcode 26 + `-destination 'generic/platform=iOS Simulator'` falha em build com erro de TBD x86_64. Workaround: usar destination concreto. Não afeta archive (que usa device slices).
