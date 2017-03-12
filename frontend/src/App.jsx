import React from 'react';

class App extends React.Component {
   render() {
      return (
         <div>
            Hello YOU LALALA World!!!!!!!!!!!!
            {this.props.children}
         </div>
      );
   }
}

export default App;