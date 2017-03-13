import React from 'react';

class App extends React.Component {
   render() {
        console.log(this.props.params.project);
      return (
         <div>
            Hello YOU LALALA World!!!!!!!!!!!!
         </div>
      );
   }
}

export default App;