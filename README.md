# Audio Player

Este projeto é um reprodutor de áudio MP3 simples, construído com React e Vite, utilizando a Web Audio API para controle de reprodução, volume e filtro.

## Funcionalidades

* **Play**: inicia ou retoma a reprodução do áudio.
* **Pause**: interrompe a reprodução, mantendo a posição atual.
* **Stop**: pausa o áudio e retorna o tempo para o início (0s).
* **Volume**: controle deslizante (0–100) que ajusta o nível de volume; em 0, o áudio fica mudo.
* **Filtro LP**: aplica ou remove um filtro passa-baixa (lowpass) ao sinal de áudio.
* **Visualização do grafo**: representa graficamente o fluxo de áudio entre os nós Source, Gain e Filter.

## Estrutura de componentes

* **`AudioPlayer.jsx`**: componente principal que:

  * Inicializa o `AudioContext`, `GainNode` e `BiquadFilterNode`.
  * Define funções de controle:

    * `handlePlay()`
    * `handlePause()`
    * `handleStop()`
    * `handleVolume(event)`
    * `toggleFilter()`
  * Renderiza a interface usando Bootstrap.

## Como usar

1. Clonar o repositório:

   ```bash
   git clone https://github.com/dayvisonmsilva/my-audio-player.git
   cd my-audio-player
   ```
2. Instalar dependências:

   ```bash
   npm install
   ```
3. Executar em modo de desenvolvimento:

   ```bash
   npm run dev
   ```
4. Acessar `http://localhost:5173` no navegador.

---

Desenvolvido com React, Vite e Bootstrap.
