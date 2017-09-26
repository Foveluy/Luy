import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a =[1,2,3,4,5]

class App extends React.Component {
  render() {
    return (
      <div>
        {a.map((item)=>{
          return(
            <div>
              {item}
            </div>
            )
        })}
      </div>
    )
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);