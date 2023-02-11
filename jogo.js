
console.log('[Nickcarv18] Flappy Bird');

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
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,

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

function fazColisao(flappyBird, chao){
    const flappyBirdY =  flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) return true;
    else return false;
}

function criaFlappyBird(){
    // [ FLAPPY BIRD ]
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
    
        pula(){
            // Atualiza a velocidade de acordo com o pulo
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza( ){
            if(fazColisao(flappyBird, chao)){
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
        desenha() {
            contexto.drawImage(
                sprites, 
                flappyBird.spriteX, flappyBird.spriteY, 
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
        },
        desenha() {
            planoFundo.desenha();
            chao.desenha();            
            globais.flappyBird.desenha();
            telaInicio.desenha();
        },
        click (){
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {

        }
    }
};

Telas.JOGO = {
    inicializa(){
        globais.flappyBird = criaFlappyBird();
    },
    desenha() {
        planoFundo.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
    }
}

function loop(){
    telasAtiva.desenha();
    telasAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if(telasAtiva.click){
        telasAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();