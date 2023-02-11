
console.log('[Nickcarv18] Flappy Bird');

let frames = 0;

const somDe_hit = new Audio;
somDe_hit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [ pLANO DE FUNDO ]
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
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza( ){
            if(fazColisao(flappyBird, globais.chao)){
                somDe_hit.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);

                return;
            }
    
            // Atualiza a velocidade de acordo com a gravidade
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            // Atualiza a posição do flappyBird na tela
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        atualizaFrameAtual(){
            const intervaloFrame = 10;
            const passouIntervalo = frames % intervaloFrame;

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

            if(globais.flappyBird.x >= par.x){
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
                    mudaParaTela(Telas.INICIO);
                }

                if(par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            });
        }
    }

    return canos;
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
        globais.flappyBird = criaFlappyBird();
        globais.chao = criaChao();
        globais.canos = criaCanos();
    },
    desenha() {
        planoFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.canos.atualiza();
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