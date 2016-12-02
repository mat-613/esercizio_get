import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {connect} from 'react-redux';
import reducer from './reducer'

const url = "http://www.basketincontro.it/api/news";
let urlGet;
function Notizia({id, value,Click}){
    return(
        <li id={id} onClick={Click}>{value}</li>
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
        console.log('comp')
        this.richiestaNews().then(async (listaNews)=>{
            console.log(listaNews);
            let notizia= await this.richiestaDettaglio(listaNews[0].id);
            console.log(notizia);
            listaNews[0].contenuto=notizia.content;
            console.log(listaNews[0].titolo)
            this.props.updateTitolo(listaNews[0].titolo);
            this.props.updateNews(notizia.content)
            this.setState({news:listaNews})
            console.log(this.props)
        });

    };

    renderNotizia() {
        console.log('rendernotizia')
        let arr = this.state.news.map(({titolo, contenuto,id}, index) => {
            return <Notizia value={titolo} key={index} id={index} Click={()=>{this.handleClick(id)}} />
        });
        return arr;

    };

    renderDettaglio(idNews) {
        console.log('renderdettalio')
        return <Dettaglio title={this.props.titolo} content={this.props.contenuto}/>
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
    handleClick(idNews){

        (async ()=>{
            console.log(idNews)
            let notizia = await this.richiestaDettaglio(idNews);
            let titolo=notizia.title;
            notizia=notizia.content;
            this.props.updateTitolo(titolo);
            this.props.updateNews(notizia)
            console.log(this.props)
            this.renderDettaglio(0)
        })();

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
let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
function mapStateToProps(state) {
    return({
         contenuto :state.mioReducer,
        titolo: state.mioSecondoReducer
    })
}
function mapDispatchToProps(dispatch){
    return({
        updateNews :(contenuto)=>{
            dispatch({type:'CAMBIO_NEWS', value:contenuto})
    },
        updateTitolo:(titolo)=>{
            dispatch({type:'CAMBIO_TITOLO', title:titolo})
        }
    })
}

let ConnectedComponent= connect(mapStateToProps,mapDispatchToProps)(Contenitore);


ReactDOM.render(
    <Provider store={store}>
  <ConnectedComponent />
    </Provider>,
  document.getElementById('root')
);
