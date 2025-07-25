import React from 'react'
import Quiz from './Components/Quiz/Quiz'
import WelcomeForm from './Components/WelcomeForm';

const App = () => {
  const [user, setUser] = React.useState(null);

  return (
    <>
      {!user ? (
        <WelcomeForm onSubmit={setUser} />
      ) : (
        <Quiz user={user} />
      )}
    </>
  );
}

export default App