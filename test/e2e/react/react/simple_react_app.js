import '../opbeat-e2e'
import React from 'react'
import ReactDOM from 'react-dom'


var CompositeComponent = React.createClass({
  render: function() {
    return (
      <span onClick={() => window.fetch('/slow-response') }>Composite component</span>
    )
  }
})

class ES6Component extends React.Component {
  render() {
    return (
      <span id="ES6Component">es6 component</span>
    )
  }
}

var FuncComponent = () => <span>func Component</span> 

  window.render = function () {
  if (window.opbeat.services) {
    window.opbeat.services.transactionService.startTransaction('demo')
  }
  ReactDOM.render(
    (
      <div>
        <CompositeComponent />
        <ES6Component />
        <FuncComponent />
      </div>
    ),
    document.getElementById('reactMount')
  )
}
