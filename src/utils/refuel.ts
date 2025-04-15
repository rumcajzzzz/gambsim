export const refuel = async (
	setPoints: React.Dispatch<React.SetStateAction<number>>, 
	setShowRefuel: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
	const newBalance = 1000;
	setPoints(newBalance);
	setShowRefuel(false);
  
	try {
	  const res = await fetch('/api/user-stats', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ setBalance: newBalance }),
	  });
  
	  if (!res.ok) {
		console.error('Failed to refuel on server');
	  } else {
		const updatedStats = await res.json();
		console.log('Balance refueled in DB:', updatedStats);
	  }
	} catch (err) {
	  console.error('Error refueling:', err);
	}
  };
  