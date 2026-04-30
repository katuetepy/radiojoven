# 📻 Radio Joven Katuete

Aplicativo web estático para GitHub Pages da **Radio Joven Katuete**.

---

## 📁 Estrutura de Arquivos

```
radio-joven-katuete/
├── index.html          ← Página principal
├── style.css           ← Estilos (dark mode, mobile-first)
├── script.js           ← Lógica do player sincronizado
├── radiojovenlogo.png  ← Logo da rádio (você deve adicionar este arquivo!)
└── README.md           ← Este arquivo
```

---

## 🔧 Como Configurar

### 1. Adicionar o Logo

Coloque o arquivo `radiojovenlogo.png` na mesma pasta do `index.html`.

### 2. Configurar o ID do Áudio (Google Drive)

Abra o arquivo `script.js` e localize a linha:

```js
const audioID = "SEU_ID_DO_GOOGLE_DRIVE_AQUI";
```

**Como obter o ID do Google Drive:**

1. Faça upload do seu áudio de 2 horas no Google Drive
2. Clique com o botão direito → **Compartilhar** → **Qualquer pessoa com o link pode ver**
3. Copie o link. Ele terá o formato:
   ```
   https://drive.google.com/file/d/1aBcDeFgHiJkLmNoP/view?usp=sharing
   ```
4. O ID é a parte entre `/d/` e `/view` → exemplo: `1aBcDeFgHiJkLmNoP`
5. Cole **apenas o ID** na variável `audioID`

---

## 🚀 Deploy no GitHub Pages

1. Crie um repositório no GitHub (ex: `radio-joven-katuete`)
2. Faça upload de todos os arquivos para a branch `main`
3. Vá em **Settings → Pages**
4. Em **Source**, selecione `Deploy from a branch` → branch `main`, pasta `/ (root)`
5. Salve. Em poucos minutos o site estará disponível em:
   ```
   https://SEU_USUARIO.github.io/radio-joven-katuete/
   ```

---

## 📢 Banner de Publicidade

O banner já está linkado para o WhatsApp da rádio:
```
https://wa.me/595921153
```
Se precisar trocar o número, edite **todas** as ocorrências no `index.html`.

---

## 🎯 Como Funciona a Sincronização

O JavaScript calcula quantos segundos se passaram desde **meia-noite** do dia atual:

```js
const secondsSinceMidnight = (agora - meianoite) / 1000;
const posicao = secondsSinceMidnight % 7200; // 7200s = 2 horas
audio.currentTime = posicao;
```

Isso garante que **todos os ouvintes** estejam escutando o mesmo ponto da transmissão, simulando uma rádio ao vivo real.

---

## ⚠️ Observação sobre CORS

A tag `<audio>` já tem o atributo `crossorigin="anonymous"` configurado, necessário para manipular `currentTime` em arquivos vindos do Google Drive.

---

*© 2025 Radio Joven Katuete – Katueté, Paraguay*
