import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class C extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      c: 2
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {

  }
  // shouldComponentUpdate(nextProps) {
  //   return this.props.name !== nextProps.name
  // }
  componentDidUpdate() {

    console.log('更新结束:context测试', this.context.fuck)
  }
  componentWillUnMount() {
    console.log('组件准备删除')
  }
  componentDidMount() {
    console.log('context测试', this.context.fuck)
  }
  click(e) {
    this.setState({
      c: this.state.c + 1
    })
    console.log('点击触发中：', this.refs)
  }
  render() {
    return (
      <div>
        外部属性:{this.props.name}->>>>{this.state.c}
        <div ref='fuck' >context fuck:{this.context.fuck}</div>
        <div>context shit:{this.context.shit}</div>
        <button onClick={this.click.bind(this)}>点我C</button>
        {React.cloneElement(this.props.children, {
          className: 'fuckshit'
        })}
      </div>
    )

  }
}

const Pure = ({ shit }) => {
  return (
    <h3>
      <p key='1'>{shit}</p>
      <p key='2'>2</p>
    </h3>
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: 1
    }
    // setInterval(() => {
    //   this.setState({ counter: this.state.counter + 1 })
    // }, 1500)
    // 
  }

  getChildContext() {
    return {
      fuck: this.state.counter + 1,
      shit: 1
    }
  }

  componentDidMount() {
    console.log('组件挂载')
  }
  componentWillMount() {
    console.log('将要挂载')
  }
  componentDidUpdate() {
    console.log('更新完毕')
  }
  click(e) {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div key={1} ref='haha' style={{ background: `rgb(99,99,${this.state.counter})` }}>
        <div dangerouslySetInnerHTML={{ __html: this.state.counter }}>111</div>
        <C name={1} >
          <h1>2</h1>
        </C>
        <button ref={(node) => { this.button = node }} onClick={this.click.bind(this)}>点我</button>
      </div>
    )
  }
}



ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);

// const appRoot = document.getElementById('root');
// const modalRoot = document.getElementById('modal-root');

// class Modal extends React.Component {
//   constructor(props) {
//     super(props);
//     this.el = document.createElement('div');
//   }

//   componentDidMount() {
//     modalRoot.appendChild(this.el);
//   }

//   componentWillUnmount() {
//     modalRoot.removeChild(this.el);
//   }

//   render() {
//     return ReactDOM.createPortal(
//       this.props.children,
//       this.el,
//     );
//   }
// }

// class Parent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {clicks: 0};
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     // This will fire when the button in Child is clicked,
//     // updating Parent's state, even though button
//     // is not direct descendant in the DOM.
//     this.setState({
//       clicks:this.state.clicks + 1
//     });
//   }

//   render() {
//     return (
//       <div onClick={this.handleClick}>
//         <p>Number of clicks: {this.state.clicks}</p>
//         <p>
//           Open up the browser DevTools
//           to observe that the button
//           is not a child of the div
//           with the onClick handler.
//         </p>
//         <Modal>
//           <Child />
//         </Modal>
//       </div>
//     );
//   }
// }

// function Child() {
//   // The click event on this button will bubble up to parent,
//   // because there is no 'onClick' attribute defined
//   return (
//     <div className="modal">
//       <button>Click</button>
//     </div>
//   );
// }

// ReactDOM.render(<Parent />, appRoot);

// // Let's create a Modal component that is an abstraction around
// // the portal API.
// class Modal extends React.Component {
//   constructor(props) {
//     super(props);
//     // Create a div that we'll render the modal into. Because each
//     // Modal component has its own element, we can render multiple
//     // modal components into the modal container.
//     this.el = document.createElement('div');
//     this.el.className = "dialog"
//   }
//   componentDidMount() {
//     // Append the element into the DOM on mount. We'll render
//     // into the modal container element (see the HTML tab).
//     modalRoot.appendChild(this.el);
//   }
//   componentWillUnmount() {
//     // Remove the element from the DOM when we unmount
//     modalRoot.removeChild(this.el);
//   }

//   render() {
//     // Use a portal to render the children into the element
//     return ReactDOM.createPortal(
//       // Any valid React child: JSX, strings, arrays, etc.
//       this.props.children,
//       // A DOM element
//       this.el,
//     );
//   }
// }
// // The Modal component is a normal React component, so we can
// // render it wherever we like without needing to know that it's
// // implemented with portals.
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {showModal: false};

//     this.handleShow = this.handleShow.bind(this);
//     this.handleHide = this.handleHide.bind(this);
//   }
//   handleShow() {
//     this.setState({showModal: true});
//   }

//   handleHide() {
//     this.setState({showModal: false});
//   }
//   render() {
//     // Show a Modal on click.
//     // (In a real app, don't forget to use ARIA attributes
//     // for accessibility!)
//     const modal = this.state.showModal ? (
//       <Modal>
//         <div className="modal">
//           <div>
//             With a portal, we can render content into a different
//             part of the DOM, as if it were any other React child.
//           </div>
//           This is being rendered inside the #modal-container div.
//           <button onClick={this.handleHide}>Hide modal</button>
//         </div>
//         <p>这是弹窗</p>
//       </Modal>
//     ) : 1;
//     return (
//       <div className="app">
//         This div has overflow: hidden.
//         <button onClick={this.handleShow}>Show modal</button>
//         {modal}
//       </div>
//     );
//   }
// }
// ReactDOM.render(<App />, appRoot);