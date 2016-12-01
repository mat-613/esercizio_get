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
let Contenitore = React.createClass({
    state : {news :[
    {
        titolo:"",
        contenuto:"",
        id:""
    }
    ]},

    renderNotizia(){
        console.log('rendernotizia')
        let arr = this.state.news.map(({titolo,contenuto},index)=>{
            return <Notizia value={titolo} id={index}/>
        });
        return arr;

    },
    renderDettaglio(idNews){
        console.log('renderdettalio')

        return <Dettaglio title={this.state.news[idNews].titolo} content={this.state.news[idNews].contenuto}/>
    },
    richiestaDettaglio(idNews){
        let id = this.state.news[idNews].id;
        this.richiestaHTTP(id).then((data)=>{
            let newArray= this.state.news.slice();
            newArray[idNews].contenuto=data.content;
            this.setState({news:newArray});
        });

    },
    richiestaHTTP(idNews= ''){
        if(idNews===''){
            urlGet= url+'?noContent=true'
        }else{
            urlGet= url +'/'+idNews
        }
        return new Promise((resolve, reject)=> {
            let xmlGetNews = new XMLHttpRequest();
            xmlGetNews.open('GET', urlGet);
            xmlGetNews.send();
            xmlGetNews.addEventListener("load", () => {
                if (xmlGetNews.readyState === XMLHttpRequest.DONE && xmlGetNews.status === 200) {
                    let listaNews = JSON.parse(xmlGetNews.responseText);
                    resolve(listaNews);
                }
                else{
                    reject();
                }
            });
        });
    },

    richiestaNews(){
        this.richiestaHTTP().then((listaNews)=>{
             listaNews=listaNews.results;
             let newArr=listaNews.map((index,item)=>{
                let notizia={
                    titolo:listaNews[item].title,
                    id:listaNews[item]._id,
                    contenuto:""
                };
                return notizia;
             });
            this.setState({news:newArr})
        });
    },

    componentWillMount(){
        this.richiestaNews();
        this.richiestaDettaglio(0)
        console.log(this.state);
    },

    render(){
        return(
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
});




ReactDOM.render(
  <Contenitore />,
  document.getElementById('root')
);
