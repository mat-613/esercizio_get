import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const url = "http://www.basketincontro.it/api/news";
let urlGet;
function Notizia({id, value}){
    return(
        <li id={id}>{value}</li>
    );

};
function Dettaglio({title, content}){
  return(
        <div>
            <h1>{title}</h1>
            <div>{content}</div>
        </div>
  );
};
class Contenitore extends React.Component {
    constructor() {
        super();
        this.state = {
            news: [
                {
                    titolo: "",
                    contenuto: "",
                    id: ""
                }
            ]
        }
        this.richiestaNews().then(async (listaNews)=>{
            console.log(listaNews);
            let notizia= await this.richiestaDettaglio(listaNews[0].id)
            console.log(notizia);

        });

    };

    renderNotizia() {
        console.log('rendernotizia')
        let arr = this.state.news.map(({titolo, contenuto}, index) => {
            return <Notizia value={titolo} key={index} id={index}/>
        });
        return arr;

    };

    renderDettaglio(idNews) {
        console.log('renderdettalio')
        return <Dettaglio title={this.state.news[idNews].titolo} content={this.state.news[idNews].contenuto}/>
    };

    richiestaDettaglio(idNews) {
        return this.richiestaHTTP(idNews);

    };

    richiestaHTTP(idNews = '') {
        if (idNews === '') {
            urlGet = url + '?noContent=true'
        } else {
            urlGet = url + '/' + idNews
        }
        return new Promise((resolve, reject) => {
            let xmlGetNews = new XMLHttpRequest();
            xmlGetNews.open('GET', urlGet);
            xmlGetNews.send();
            xmlGetNews.addEventListener("load", () => {
                if (xmlGetNews.readyState === XMLHttpRequest.DONE && xmlGetNews.status === 200) {
                    let listaNews = JSON.parse(xmlGetNews.responseText);
                    resolve(listaNews);
                }
                else {
                    reject();
                }
            });
        });
    }

    richiestaNews() {
        return this.richiestaHTTP().then((listaNews) => {
            listaNews = listaNews.results;
            return listaNews.map((index, item) => {
                let notizia = {
                    titolo: listaNews[item].title,
                    id: listaNews[item]._id,
                    contenuto: ""
                };
                return notizia;
            });

        });
    }


    render() {
        return (
            <div>
                <ul>
                    {this.renderNotizia()}
                </ul>
                <div>
                    {this.renderDettaglio(0)}
                </div>
            </div>
        );
    }
}



ReactDOM.render(
  <Contenitore />,
  document.getElementById('root')
);
