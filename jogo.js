
console.log('[Nickcarv18] Flappy Bird');

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

// [ FLAPPY BIRD ]
const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,

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

function loop(){
    planoFundo.desenha();
    chao.desenha();
    flappyBird.desenha();

    requestAnimationFrame(loop);
}

loop();