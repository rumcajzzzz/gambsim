export default function Footer() {
	return (
	  <footer className="text-gray-400 py-6 mt-16">
		<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
		
		  <div className="flex items-center space-x-3">
			<div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm text-gray-500 font-bold">
			  <img src="/casinochip.svg" alt="casino chip image" className="aspect-1/1 invert"/>
			</div>
			<span className="text-gray-300 font-semibold text-base">Roulette Simulator</span>
		  </div>

		  <div className="flex items-center space-x-2">
			<span className="text-sm">by</span>
			<p className="text-sm font-medium text-gray-300">rumcajs</p>
			<img
			  src="/rmzclogo.svg"
			  alt="rmzc logo"
			  className="w-20 h-20 object-contain opacity-80"
			/>
		  </div>
		</div>

		<div className="mt-4 text-center text-xs text-gray-500">
		  © {new Date().getFullYear()} All rights reserved. Alpha version — features subject to change.
		</div>
	  </footer>
	);
  }
  