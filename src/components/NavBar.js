import React, { Component } from 'react';
import NavBarItem from './NavBarItem';
import { APP_NAME } from '../constants'

class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items : [
                { name : "Reservas", href : "/", active : true },
                { name : "Checki-In", href : "/form", active : false},
                { name : "Balcão", href : "/formList", active : false},
                { name : "Cadastros", href : "/formRel", active : false}

            ]
        }
        this.onClickHandler = this.onClickHandler.bind(this);
    }                                                                 

    onClickHandler(itemClicked) {
         const items = [...this.state.items]
         items.forEach(item => {
             if(item.name === itemClicked.name){
                 item.active = true;
             } else {
                 item.active = false;
             }
         })

         this.setState({items});
    }

    render() {
        return (
            <div>
               <nav className="navbar navbar-expand-lg navbar-light bg-light">
               <span className="navbar-brand mb-0 h1">{APP_NAME}</span>
               <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                 <span className="navbar-toggler-icon"></span>
               </button> 
               <div className="collapse navbar-collapse" id="navbarText">
               <div className="navbar-nav mr-auto">                      
               {this.state.items.map(
                   i => <NavBarItem 
                         key={i.name}
                         item={i}
                         onClick={this.onClickHandler}/> )}
             </div>            
            </div>
            </nav>
           </div> 
        );
    }
}

export default NavBar;