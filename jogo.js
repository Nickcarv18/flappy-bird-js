console.log('[Nickcarv18] Flappy Bird');

let frames = 0;
let best = localStorage.getItem("Best") || 0;
let tocouSomHit = false;

const somDe_hit = new Audio;
somDe_hit.src = './efeitos/hit.wav';

const somDe_pulo = new Audio;
somDe_pulo.src = './efeitos/pulo.wav';

const somDe_cair = new Audio;
somDe_cair.src = './efeitos/caiu.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [ TELA DE INÍCIO ]
const telaInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2, 
    y: 50,

    desenha() {
        contexto.drawImage(
            sprites, 
            telaInicio.spriteX, telaInicio.spriteY, 
            telaInicio.largura, telaInicio.altura, 
            telaInicio.x, telaInicio.y,  
            telaInicio.largura, telaInicio.altura 
        )
    }
}

// [ PLANO DE FUNDO ]
const planoFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {
        contexto.fillStyle = '#70c5ce'; // Cria uma figura em formato de quadrado
        contexto.fillRect(0, 0, canvas.width, canvas.height); //Add o quadrado no canvas

        contexto.drawImage(
            sprites, 
            planoFundo.spriteX, planoFundo.spriteY, 
            planoFundo.largura, planoFundo.altura, 
            planoFundo.x, planoFundo.y,  
            planoFundo.largura, planoFundo.altura 
        );

        contexto.drawImage(
            sprites, 
            planoFundo.spriteX, planoFundo.spriteY, 
            planoFundo.largura, planoFundo.altura, 
            (planoFundo.x + planoFundo.largura), planoFundo.y,  
            planoFundo.largura, planoFundo.altura 
        );
    }
}

// [ TELA FIM DE JOGO ]
const gameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2, 
    y: 50,    
    medalhas: [
        {altura: 44, largura: 44, spriteX: 0, spriteY: 78}, // Medalha 1
        {altura: 44, largura: 44, spriteX: 48, spriteY: 78}, // Medalha 2
        {altura: 44, largura: 44, spriteX: 0, spriteY: 124},  // Medalha 3
        {altura: 44, largura: 44, spriteX: 48, spriteY: 124}, // Medalha 4
    ],

    desenha() {             
        contexto.drawImage(
            sprites, 
            gameOver.spriteX, gameOver.spriteY, 
            gameOver.largura, gameOver.altura, 
            gameOver.x, gameOver.y,  
            gameOver.largura, gameOver.altura 
        );

        // Add texto do placar
        contexto.font = "30px 'VT323'";
        contexto.fillStyle = "black"
        contexto.textAlign = 'right';
        contexto.fillText(`${globais.placar.pontuacao}`, canvas.width - 70, 144);

        // Add texto do melhor placar
        contexto.font = "30px 'VT323'";
        contexto.fillStyle = "black"
        contexto.textAlign = 'right';
        contexto.fillText(`${best}`, canvas.width - 70, 190); 
    },
    desenhaMedalha(medalha){
        contexto.drawImage(
            sprites, 
            gameOver.medalhas[medalha].spriteX, gameOver.medalhas[medalha].spriteY, 
            gameOver.medalhas[medalha].largura, gameOver.medalhas[medalha].altura, 
            72, 136,  
            gameOver.medalhas[medalha].largura, gameOver.medalhas[medalha].altura 
        );
    },
    atualizaMedalha(){    
        if(globais.placar.pontuacao >= 0 && globais.placar.pontuacao <= 5){
            gameOver.desenhaMedalha(0);
            return;
        }

        else if(globais.placar.pontuacao >= 6 && globais.placar.pontuacao <= 10){
            gameOver.desenhaMedalha(1);
            return;
        }

        else if(globais.placar.pontuacao >= 11 && globais.placar.pontuacao <= 20){
            gameOver.desenhaMedalha(2);
            return;
        }

        else if(globais.placar.pontuacao >= 21){
            gameOver.desenhaMedalha(3);
            return;
        }        
    },
}

// [ CHÃO ]
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na sprite (Largura e altura da imagem)
                chao.x, chao.y,  // Posição no qual o recorte vai aparecer no canvas
                chao.largura, chao.altura // Dentro do canvas qual vai ser o tamanho do recorte
            );

            // Add uma segunda imagem para completar o desenho do chão
            contexto.drawImage(
                sprites, 
                chao.spriteX, chao.spriteY, 
                chao.largura, chao.altura, 
                (chao.x + chao.largura), chao.y, // Add a imagem no X largura máxima (224px) da imagem
                chao.largura, chao.altura 
            );
        }

    }
    return chao;
}

function fazColisao(flappyBird, chao){
    const flappyBirdY =  flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) return true;
    else return false;
}

// [ FLAPPY BIRD ]
function criaFlappyBird(){
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        gravidade: 0.25,
        velocidade: 0,
        movimentos: [
            {spriteX: 0, spriteY: 0}, // Asa para cima
            {spriteX: 0, spriteY: 26}, // Asa no meio
            {spriteX: 0, spriteY: 52},  // Asa para baixo
            {spriteX: 0, spriteY: 26}, // Asa no meio
        ],
        frameAtual: 0,
    
        pula(){
            // Atualiza a velocidade de acordo com o pulo
            somDe_pulo.play();
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza( ){
            if(fazColisao(flappyBird, globais.chao)){
                const intervaloFrameColisao = 200;
                const passouIntervalo = frames % intervaloFrameColisao;
                
                if(passouIntervalo){
                    mudaParaTela(Telas.GAME_OVER);
                }

                if(best < globais.placar.pontuacao || best === 0){
                    best = globais.placar.pontuacao;

                    localStorage.setItem("Best", best);
                }

                return;
            }
    
            // Atualiza a velocidade de acordo com a gravidade
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            // Atualiza a posição do flappyBird na tela
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        atualizaFrameAtual(){
            const intervaloFrameFlappy = 10;
            const passouIntervalo = frames % intervaloFrameFlappy;

            if(passouIntervalo == 0){
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
    
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            // Set recorte de acordo com o movimento e frame
            flappyBird.atualizaFrameAtual();
            const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual]; 

            contexto.drawImage(
                sprites, 
                spriteX, spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y,  
                flappyBird.largura, flappyBird.altura 
            )
        }
    }

    return flappyBird;
}

// [ CANOS ]
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

        temColisaoComFlappyBird(par){
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x){
                if(cabecaFlappy <= par.canoCeu.y){
                    return true;
                }
                
                if(peFlappy >= par.canoChao.y){
                    return true;
                }
            }
            
            return false;
        },
        desenha() {            
            canos.pares.forEach(function(par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                // Cano do Céu          
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                contexto.drawImage(
                    sprites, 
                    canos.ceu.spriteX, canos.ceu.spriteY, 
                    canos.largura, canos.altura, 
                    canoCeuX,canoCeuY,  
                    canos.largura, canos.altura 
                );
    
                // Cano do Chão  
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites, 
                    canos.chao.spriteX, canos.chao.spriteY, 
                    canos.largura, canos.altura, 
                    canoChaoX, canoChaoY,  
                    canos.largura, canos.altura 
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canoCeuY + canos.altura
                }

                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            });

        },
        atualiza(){
            const passou100Frames = frames % 100 === 0;

            if(passou100Frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                });

            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(canos.temColisaoComFlappyBird(par)){
                    somDe_hit.play();
                    somDe_cair.play();

                    if(best < globais.placar.pontuacao || best === 0){
                        best = globais.placar.pontuacao;

                        localStorage.setItem("Best", best);
                    }

                    mudaParaTela(Telas.GAME_OVER);
                }

                if(par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            });
        }
    }

    return canos;
}

function criaPlacar(){
    const placar = {
        pontuacao: 0,

        atualiza(){
            const intervaloFramePontuacao = 10;
            const passouIntervalo = frames % intervaloFramePontuacao == 0;

            if(passouIntervalo){
                placar.pontuacao = placar.pontuacao + 1;
            }
        },
        desenha() {
            contexto.font = "35px 'VT323'";
            contexto.fillStyle = "black"
            contexto.textAlign = 'right';
            contexto.fillText(`Score ${placar.pontuacao}`, canvas.width - 10, 35);
        }
    }

    return placar;
}

// ------------------------------------------
//                 [ TELAS ]
// ------------------------------------------
const globais = {};
let telasAtiva = {}
function mudaParaTela(novaTela){
    telasAtiva = novaTela;

    if(telasAtiva.inicializa()){
        inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();            
            telaInicio.desenha();
        },
        click (){
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    inicializa(){
        globais.placar = criaPlacar();
    },
    desenha() {
        planoFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.placar.atualiza();
    }
}

Telas.GAME_OVER = {
    inicializa(){
        
    },
    desenha() {
        planoFundo.desenha();
        globais.canos.desenha();
        globais.flappyBird.desenha();
        globais.chao.desenha();         
        gameOver.desenha();        
    },
    click(){
       mudaParaTela(Telas.INICIO);
    },
    atualiza() {
        globais.flappyBird.atualiza();
        gameOver.atualizaMedalha();
    }
}

function loop(){
    telasAtiva.desenha();
    telasAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if(telasAtiva.click){
        telasAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();