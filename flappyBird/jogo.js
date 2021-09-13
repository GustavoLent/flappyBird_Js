console.log('[DevSoutinho] Flappy Bird');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const somHit = new Audio()
somHit.src = './efeitos/hit.wav'

let frames = 0
let globais = {}

const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

const mensagemFimDeJogo = {
  sX: 134,
  sY: 153,
  w:  226,
  h:  200,
  x: (canvas.width / 2) - (226 / 2),
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemFimDeJogo.sX, mensagemFimDeJogo.sY,
      mensagemFimDeJogo.w, mensagemFimDeJogo.h,
      mensagemFimDeJogo.x, mensagemFimDeJogo.y,
      mensagemFimDeJogo.w, mensagemFimDeJogo.h
    );
  }
}

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
      contexto.fillStyle = '#70c5ce';
      contexto.fillRect(0,0, canvas.width, canvas.height)
  
      contexto.drawImage(
        sprites,
        planoDeFundo.spriteX, planoDeFundo.spriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        planoDeFundo.x, planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
      );
  
      contexto.drawImage(
        sprites,
        planoDeFundo.spriteX, planoDeFundo.spriteY,
        planoDeFundo.largura, planoDeFundo.altura,
        (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
        planoDeFundo.largura, planoDeFundo.altura,
      );
    },
};

const telas = {
  INICIO: {
    atualiza(){
      globais.chao.atualiza()
      globais.flappyBird.atualizaOMovimentoAtual()
    },
    click(){
      mudaParaTela(telas.JOGO)
    },
    desenha(){
      planoDeFundo.desenha()
      globais.chao.desenha()
      globais.flappyBird.desenha()
      mensagemGetReady.desenha()
    },
    inicializa(){
      globais.flappyBird = criaFlappyBird()
      globais.chao = criaChao()
      globais.canos = criaCanos()
    }
  },

  JOGO: {
    atualiza(){
      globais.chao.atualiza()
      globais.flappyBird.atualiza()
      globais.flappyBird.atualizaOMovimentoAtual()
      globais.canos.atualiza()
      globais.placar.atualiza()
    },
    click(){
      globais.flappyBird.pula()
    },
    desenha(){
      planoDeFundo.desenha()
      globais.canos.desenha()
      globais.chao.desenha()
      globais.flappyBird.desenha()
      globais.placar.desenha()
    },
    inicializa(){
      globais.placar = criaPlacar()
    }
  },

  FIM: {
    atualiza(){
    },
    click(){
      mudaParaTela(telas.INICIO)
    },
    desenha(){
      planoDeFundo.desenha()
      globais.canos.desenha()
      globais.chao.desenha()
      globais.flappyBird.desenha()
      mensagemFimDeJogo.desenha()
    },
  },
}

let telaAtiva = {}

function criaCanos(){
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    pares: [],
    temColisaoComOFlappy(par){
      const tolerancia = 5;

      const cabecaDoFlappy = globais.flappyBird.y
      const alturaDoFlappy = globais.flappyBird.altura
      const peDoFlappy = cabecaDoFlappy + alturaDoFlappy

      const posiçãoDoFlappy = (globais.flappyBird.x + globais.flappyBird.largura) 

      const xDoImpactoComCano = par.x + tolerancia
      
      if(posiçãoDoFlappy >= xDoImpactoComCano){
        const yDoImpactoComCanoSuperior = par.canoCeu.y


        const colidiuCabeca = cabecaDoFlappy <= yDoImpactoComCanoSuperior
        const colidiuPe = peDoFlappy >= par.canoChao.y

        return colidiuCabeca || colidiuPe
      }

      return false

    },
    atualiza(){
      const passou100Frames = frames % 100 === 0

      if(passou100Frames){
        const canoInicioX = canvas.width
        const canoRandomY = -150 * (Math.random() + 1)

        canos.pares.push( {x: canoInicioX, y: canoRandomY} )
      }

      canos.pares.forEach(par => {
        par.x = par.x - 2 // desloca par de canos para a esquerda
        
        let temColisao = canos.temColisaoComOFlappy(par)

        if(temColisao){
          somHit.play()
          mudaParaTela(telas.FIM)
        }

        if(par.x + canos.largura <= 0){
          canos.pares.shift()
        }
      })

    },
    desenha() {
      canos.pares.forEach( par => {
        const espacamentoEntreCanos = 90
        
        const canoCeuX = par.x
        const canoCeuY = par.y
        
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        );
          
        const canoChaoX = par.x
        const canoChaoY = canos.altura + par.y + espacamentoEntreCanos
        
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        }
        
      })
    },
  };

  return canos
}

function criaChao(){
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
      const incremento = 1
      const repeteEm = chao.largura / 2
      const movimentacao = chao.x - incremento
      chao.x = movimentacao % repeteEm
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };

  return chao
}

function criaFlappyBird(){
  const flappyBird = {
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    movimentos: [
      {spriteX: 0, spriteY:  0,}, // asa para cima
      {spriteX: 0, spriteY: 26,}, // asa no meio
      {spriteX: 0, spriteY: 52,}, // asa para baixo
      {spriteX: 0, spriteY: 26,}, // asa no meio
    ],
    movimentoAtual: 0,
    atualiza(){
      const houveColisao = fazColisao(flappyBird, globais.chao)
      
      if(houveColisao){
        somHit.play()
        setTimeout(() => { 
          mudaParaTela(telas.FIM) 
        }, 200);
        return
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
      flappyBird.y = flappyBird.y + flappyBird.velocidade
    },
    atualizaOMovimentoAtual(){
      const intervaloDeFrames = 10
      const deveAtualizar = frames % intervaloDeFrames === 0

      if(deveAtualizar){ 
        const baseDoIncremento = 1
        const incremento = flappyBird.movimentoAtual + baseDoIncremento
        const baseRepeticao = flappyBird.movimentos.length
        
        const proxMovimento = incremento % baseRepeticao
        flappyBird.movimentoAtual = proxMovimento
      }
    },
    desenha() {
      const movimentoAtual = flappyBird.movimentoAtual
      const { spriteX, spriteY} = flappyBird.movimentos[movimentoAtual]

      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x,       flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );

    },
    pula() {
      flappyBird.velocidade = - flappyBird.pulo
    }
  }

  return flappyBird
}

function criaPlacar(){
  const placar = {
    pontuacao: 0,
    atualiza(){
      const intervaloDeFrames = 10
      const deveAtualizar = frames % intervaloDeFrames === 0

      if(deveAtualizar){ 
        placar.pontuacao = placar.pontuacao + 1
      }

    },
    desenha() {
      const textoPosicaoY = 50
      const textoPosicaoX = canvas.width - 15

      contexto.font = '30px "Press Start 2P"'
      contexto.textAlign = 'right'
      contexto.fillStyle = 'white'
      contexto.fillText(`${placar.pontuacao}`, textoPosicaoX, textoPosicaoY)
    },
  }

  return placar
}

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura
  const chaoY = chao.y

  return flappyBirdY >= chaoY
}

function mudaParaTela(novaTela){
  telaAtiva = novaTela
  
  if(telaAtiva.inicializa){
    telaAtiva.inicializa()
  }
}

mudaParaTela(telas.INICIO)

function loop(){
  telaAtiva.atualiza()
  telaAtiva.desenha()
  
  frames++
  requestAnimationFrame(loop)
}

window.addEventListener('click', ()=>{
    if(telaAtiva.click){
        telaAtiva.click()
    }
})

loop()