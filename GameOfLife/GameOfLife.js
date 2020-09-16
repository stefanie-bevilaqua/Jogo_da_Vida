let iniciar = false; //quando clicar no botão para iniciar, será verdadeiro

const ls = 21; //linhas
const cs = 60; //colunas

function cidade() {
    let cidade = document.querySelector('#cidade');
    let tabela = document.createElement('table');
for (let x = 0; x < ls; x++) {
        let tr = document.createElement('tr');
        for (let y = 0; y < cs; y++) {
            let célula = document.createElement('td');
            célula.setAttribute('id', x + '_' + y);         //adiciona um atributo id a cada célula p/ podermos controlá-las
            célula.setAttribute('class', 'morta');         //no início todas células estão mortas
            célula.addEventListener('click',viverMorrer); //evento que alterna entre mortas e vivas
                 
            tr.appendChild(célula);
        }
        tabela.appendChild(tr);
    }
    cidade.appendChild(tabela);
}
//_______________________________Criamos a tabela, com todas as células mortas_________________________________


function viverMorrer() {
    let localizacao = this.id.split("_");
    let l = Number(localizacao[0]); //obter x que é a LINHA
    let c = Number(localizacao[1]); //obter y que é a COLUNA    
    if (this.className === 'viva'){ //clique para mudar células de mortas para vivas
        this.setAttribute('class', 'morta');
        geracao[l][c] = 0; //essa linha é adicionada após definirmos valor da matriz____0 para morta
    }
    else{
        this.setAttribute('class', 'viva'); //1 para viva
        geracao[l][c] = 1;
       
    }
}
//_____________________________________Alternarnamos entre mortas e vivas_______________________________________


//__________________________________________Armazenando geração atual___________________________________________
let geracao =[ls];      //Matrizes unidimensionais com base no núm de linhas
let proxGeracao =[ls];  

// Criando matrizes bidimensionais, como se fosse uma matriz de matrizes
function criaGeracao() { 
    for (let x = 0; x < ls; x++) {
        geracao[x] = new Array(cs);
        proxGeracao[x] = new Array(cs);
    }
}
function valorGeracao() { //Define os valores da matriz
    for (let x = 0; x < ls; x++) {
        for (let y = 0; y < cs; y++) {
            geracao[x][y] = 0;      //inicia definindo todos os locais
            proxGeracao[x][y] = 0;  //da matriz como 0, mortas
        }
    }
}

window.onload = function(){  //manipula eventos de carregamento, no caso chamará as três funções
    cidade();                //nossa função com a tabela
    criaGeracao();           //armazenando nossa geração
    valorGeracao();          //valores das posições
}
//_____________________________________________________________________________________________________________

//_____________________________________________Aplicando as regras_____________________________________________

//______________________Aplicando__as__regras__e__contando__o__número__de__vizinhos______________________________
function contVizinhos(l, c) {
    let count = 0;
    let nl = Number(l); //núm linha
    let nc = Number(c); //núm coluna
    
    //verificando se não estamos na primeira linha da tabela
    if (nl - 1 >= 0) {
        //verificando vizinho de cima
        if (geracao[nl - 1][nc] == 1) 
            count++;
    }
    //verificando se não estamos na primeira célula 
    if (nl - 1 >= 0 && nc - 1 >= 0) {
        //verificando vizinho esquerdo de cima
        if (geracao[nl - 1][nc - 1] == 1) 
            count++;
    }
    //verificando se não estamos na primeira linha da última coluna 
    if (nl - 1 >= 0 && nc + 1 < cs) {
            //verificando vizinho direito de cima
            if (geracao[nl - 1][nc + 1] == 1) 
                count++;
    }
    //verificando se não estamos na primeira coluna 
    if (nc - 1 >= 0) {
        //verificando vizinho esquerdo 
        if (geracao[nl][nc - 1] == 1) 
            count++;
    }
    //verificando se não estamos na última coluna
    if (nc + 1 < cs) {
        //verificando vizinho direito 
        if (geracao[nl][nc + 1] == 1) 
            count++;
    }
    //verificando se não estamos no canto inferior esquerdo 
    if (nl + 1 < ls && nc - 1 >= 0) {
        //verificando vizinho esquerdo debaixo
        if (geracao[nl + 1][nc - 1] == 1) 
            count++;
    }
    //verificando se não estamos no canto inferior direito
    if (nl + 1 < ls && nc + 1 < cs) {
        //verificando vizinho direito debaixo
        if (geracao[nl + 1][nc + 1] == 1) 
            count++;
    }
    //verificando se não estamos na última linha
    if (nl + 1 < ls) {
        //verificando vizinho de baixo
        if (geracao[nl + 1][nc] == 1) 
            count++;
    }
    return count;
}
//______________________________________________________________________________________________________________

//__Percorrerá_a_contagem_de_vizinhos_verificando_se_a_célula_permanece_viva_ou_morta_para_a_próxima_geração___
function novaGeracao() {
    for (l in geracao) {
        for (c in geracao[l]) {
            let vizinhos = contVizinhos(l, c);
            //verificando as regras 
            //se a célula estiver viva
            if (geracao[l][c] == 1) {
                if (vizinhos < 2) {  //morre de solidão
                    proxGeracao[l][c] = 0;
                } 
                else if (vizinhos == 2 || vizinhos == 3) {  //se ela tiver 2 ou três vizinhos, permanece viva
                    proxGeracao[l][c] = 1;
                } 
                else if (vizinhos > 3) {  //morre de superpopulação
                    proxGeracao[l][c] = 0;
                }
            } 
            else if (geracao[l][c] == 0) {
                if (vizinhos == 3) {  //se estiver morta, mas tem 3 vizinhos ela se torna viva
                    proxGeracao[l][c] = 1;
                }
            }
        }
    }
}
//__________________________________________________________________________________________________________________

//__________________________________________________Atualizando a cidade____________________________________________
function atualizaGeracao() {
    for (l in geracao) {  
        for (c in geracao[l]) {
            //atualiza a matriz da geração atual com os valores da novaGeracao
            geracao[l][c] = proxGeracao[l][c];
        }
    }
}

function atualizaCidade() {  //atualiza exibição visual da cidade
    let celula='';
    for (l in geracao) {
        for (c in geracao[l]) {
            celula = document.getElementById(l + '_' + c);
            if (geracao[l][c] == 0) {
                celula.setAttribute('class', 'morta');
            } 
            else {
                celula.setAttribute('class', 'viva');
            }
        }
    }
}

//______________________________Botões Iniciar/Parar e Recarregar_________________________________________
function evoluindo(){
    novaGeracao();     //verifica se as células permanecerão vivas ou mortas p/ próx geração 
    atualizaGeracao(); //atualiza valores da geração
    atualizaCidade();   //atualiza exibição

    if (iniciar) {
        timer = setTimeout(evoluindo, 100); //velocidadede evolução das células
    }
}

function iniciarParar(){
    let iniciarParar = document.querySelector('#btniniciarparar');
    if (!iniciar) {
       iniciar = true; //verdadeiro quando clicar p/ iniciar
       iniciarParar = iniciarParar;
       evoluindo();
     } 
     else {
        iniciar = false;  //falso, para a evolução
        iniciarParar = iniciarParar;
    }
}

function novaCidade() {
    location.reload(); //recarregar uma nova cidade
}
//_______________________________________________FIM__________________________________________________