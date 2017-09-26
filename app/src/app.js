import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class App extends React.Component {
  constructor(props) {
    super()

    // setInterval(() => {
    //   this.setState()
    // }, 1000);
  }
  render() {
    return (
      <div>
        <div style={{ background: 'rgba(120,120,120,0.3)', color: 'white' }}>
          it works!
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);