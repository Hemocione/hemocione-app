# Release Follow-ups

Itens de débito técnico identificados durante releases que ficaram para o próximo ciclo. Sempre que abrir um novo bump de versão, dá uma checada aqui antes pra varrer o que dá pra resolver junto.

## Pendentes — endereçar no próximo release (0.2.2)

### iOS — Info.plist

#### 1. Adicionar `NSLocationWhenInUseUsageDescription`

- **Origem:** Apple ITMS-90683 warning ao subir build 0.2.1 (2). SDK do OneSignal referencia `CLLocationManager` no binário, então Apple exige a string mesmo sem o app chamar localização.
- **Fix:** adicionar em `ios/App/App/Info.plist`:
  ```xml
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Sua localização permite sugerir locais de doação próximos a você.</string>
  ```
- **Custo:** ~30s.
- **Bloqueante?** Não (warning, não erro). Build 0.2.1 (2) foi aceita. Sem o fix, vai aparecer em todo upload futuro.

#### 2. Adicionar `ITSAppUsesNonExemptEncryption=false`

- **Origem:** Hoje todo upload força a pergunta de export compliance no App Store Connect ("Does your app use encryption?"). É fácil errar a resposta no fluxo manual (aconteceu na 0.2.1).
- **Fix:** adicionar em `ios/App/App/Info.plist`:
  ```xml
  <key>ITSAppUsesNonExemptEncryption</key>
  <false/>
  ```
- **Justificativa:** Hemocione usa apenas HTTPS via WKWebView e cryptografia OS-provided. Qualifica para isenção (Cat 5 Part 2 das US Export Administration Regulations). Marcar `false` aqui significa "não usa criptografia não-isenta" — equivalente legal a responder "No" no popup, mas resolvido estaticamente.
- **Custo:** ~30s.
- **Bloqueante?** Não (cosmético no fluxo de release, mas evita erro humano).

### Android — Signing config no Gradle

#### 3. Adicionar `signingConfig` em `android/app/build.gradle` lendo de `keystore.properties`

- **Origem:** Release Android v0.2.1 exigiu Android Studio GUI (Build → Generate Signed Bundle / APK) porque não há `signingConfigs` configurado em `app/build.gradle`. `./gradlew bundleRelease` produz AAB unsigned, que o Play Console rejeita.
- **Fix:**
  1. Criar `android/keystore.properties` (gitignored) com:
     ```properties
     storeFile=../hemocione.keystore
     storePassword=...
     keyAlias=...
     keyPassword=...
     ```
  2. Em `android/app/build.gradle`, no topo:
     ```gradle
     def keystorePropertiesFile = rootProject.file("keystore.properties")
     def keystoreProperties = new Properties()
     if (keystorePropertiesFile.exists()) {
         keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
     }
     ```
  3. Adicionar dentro do bloco `android { ... }`:
     ```gradle
     signingConfigs {
         release {
             if (keystorePropertiesFile.exists()) {
                 storeFile rootProject.file(keystoreProperties['storeFile'])
                 storePassword keystoreProperties['storePassword']
                 keyAlias keystoreProperties['keyAlias']
                 keyPassword keystoreProperties['keyPassword']
             }
         }
     }
     buildTypes {
         release {
             signingConfig signingConfigs.release
             // ... linhas existentes (minifyEnabled, proguardFiles)
         }
     }
     ```
  4. Adicionar `keystore.properties` ao `.gitignore` (e ao `.gitignore` do android/, por segurança).
- **Custo:** ~15min (config + 1 build de teste local).
- **Benefício:** release Android scriptável (`./gradlew bundleRelease`), base para CI/automação futura, menos dependência de GUI.
- **Bloqueante?** Não. Fluxo Android Studio GUI continua funcionando.

## Histórico

### v0.2.1 — 2026-05-09

- **Conteúdo:** upgrade Capacitor 7 → 8; remoção temporária do item "Vestir a Camisa" do menu lateral.
- **Status:** submetida para review nas duas stores (Play Console production + App Store Connect, manual release).
- **Caveats observados durante o release:**
  - ⚠️ ITMS-90683 (location usage description) — vide item 1.
  - ⚠️ Pergunta de export compliance respondida manualmente no App Store Connect — vide item 2.
  - ⚠️ Build Android via GUI — vide item 3.
  - 🛠️ Cap 8 exige JDK 21+. Local default é 1.8; usado `JAVA_HOME=/opt/homebrew/opt/openjdk@23` ad hoc para o build Android.
  - 🛠️ Xcode 26 + `-destination 'generic/platform=iOS Simulator'` falha em build com erro de TBD x86_64. Workaround: usar destination concreto. Não afeta archive (que usa device slices).
