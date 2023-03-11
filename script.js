async function getCurrentPrice() {
	const data = await $.getJSON();
	return {
		
	}
}

//function to delete a stock and empty a stock slot
const deleteStock = (slotNum) => {
	/*
		clear the global variable
		set the innerHTMLs to default text or empty
	*/
	slot[slotNum - 1] = "";
	
	let slotID = "slot" + slotNum;
	document.getElementById(slotID).querySelector("#symbol").innerHTML = "Empty";
	document.getElementById(slotID).querySelector("#price").innerHTML = "Empty";
	localStorage.removeItem(slotID);
	
};
	

//function to update a stock slot with a new stock 
const updateStock = (slotNum) => {
	/*
		take input
		make API call
		override global var
		override innerHTMLs
	*/

	let input = document.getElementById("search-bar").value;
	let call = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + input + "&apikey=TQEYVSSUFEDJAQU5";
	
	$.getJSON(call)
	.done(function(data){
		let price = data["Global Quote"]["05. price"];
		let symbol = data["Global Quote"]["01. symbol"];
		
		if(price == undefined) {
			let slotID = "slot" + slotNum;
			document.getElementById(slotID).querySelector("#symbol").innerHTML = "Invalid Stock";
			document.getElementById(slotID).querySelector("#price").innerHTML = "Please Try Again";
		} else {
			let slotID = "slot" + slotNum;
			document.getElementById(slotID).querySelector("#symbol").innerHTML = symbol;
			document.getElementById(slotID).querySelector("#price").innerHTML = price;
			slot[slotNum - 1] = symbol;
		
			
			localStorage.setItem(slotID,  symbol); 

		}
		
	});


};

const getInfo = () => {
	//let slotID = "slot" + slotNum;
	//let symbol = slot[slotNum - 1];
	//symbol = "IBM";
	let symbol = localSlot;
	let call = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=TQEYVSSUFEDJAQU5";
	
	//current price call
	$.getJSON(call)
	.done(function(data) {
		let price = data["Global Quote"]["05. price"];
		document.getElementById("currentPrice").innerHTML = price;
	});
	
	//open and close price call
	call = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=5min&apikey=TQEYVSSUFEDJAQU5";
	$.getJSON(call)
	.done(function(data) {
		let time = data["Meta Data"]["3. Last Refreshed"];
		
		let openPrice = data["Time Series (5min)"][time]["1. open"];
		let closePrice = data["Time Series (5min)"][time]["4. close"];
		
		document.getElementById("open").innerHTML = openPrice;
		document.getElementById("close").innerHTML = closePrice;
		
	});

	// beta, pe ratio, and earnings per share call
	call = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + symbol + "&apikey=TQEYVSSUFEDJAQU5";
	$.getJSON(call)
	.done(function(data) {
		let beta = data["Beta"];
		let pe = data["PERatio"];
		let eps = data["EPS"];
		let name = data["Name"];
		
		
		document.getElementById("beta").innerHTML = beta;
		document.getElementById("pe").innerHTML = pe;
		document.getElementById("eps").innerHTML = eps;
		document.getElementById("symbol").innerHTML = name;
	});
	
};


const BASE_URL = "https://www.alphavantage.co/query?apikey=3C7FVRDGXUUJAQIO&function=TIME_SERIES_MONTHLY_ADJUSTED&datatype=json&symbol=";
API = { get };


function get(url) {
	return fetch(url)
	.then(response => response.json())
	.then(data => formatData(data))
	.then(result => {
		chart.innerText = "";
		new ApexCharts(document.querySelector("#chart"), options).render();
	});
}

function formatData(stockData)
{
	options.title.text = stockData["Meta Data"]["2. Symbol"];
	let solution = [];
	Object.entries(stockData["Monthly Adjusted Time Series"]).forEach(
	([month, monthlyPrices]) => {
	let obj = {};
	obj.x = new Date(month);
	let prices = [];
	prices.push(monthlyPrices["1. open"]);
	prices.push(monthlyPrices["2. high"]);
	prices.push(monthlyPrices["3. low"]);
	prices.push(monthlyPrices["4. close"]);
	obj.y = prices;
	solution.push(obj);
	},
	);
	options.series[0].data = solution.sort((a, b) => a.x - b.x);
}

const chart = document.querySelector("#chart");


let options = {
	chart: {
	type: "candlestick",
	},
	series: [
	{
	data: [],
	},
	],
	title: {
	text: "",
	align: "center",
	},
	xaxis: {
	type: "datetime",
	},
	yaxis: {
	tooltip: {
	enabled: true,
	},
	},
	};

const graph = (slotNum) => 
{
	let slotID = "slot" + slotNum;
	let symbol = localSlot;
	API.get(`${BASE_URL}${symbol}`);
}
		

/*
const graph = (slotNum) => 
{
	let slotID = "slot" + slotNum;
	slotID.addEventListener("#information", handleInformation);
}
	
function handleInformation()
{
		event.preventDefault();
		let slotID = "slot" + slotNum;
		let symbol = document.getElementById(slotID).querySelector("#symbol").innerHTML;		
		slot[slotNum - 1] = symbol
		API.get(`${BASE_URL}${symbol}`);
}
*/
	



//set local storage
let slot = ["", "", "", "", "", "", "", "", "", ""];

let slotID = ""; 



function indexLoad()
{
	
	for (let i = 1; i < 11; i++)
	{
		slotID = "slot" + i;
		slot[i - 1] = localStorage.getItem(slotID);
		//document.getElementById("storage" + i).querySelector("#symbol").innerHTML = localStorage.getItem(slotID);
	}
}


//document.getElementById("storage1").querySelector("#symbol").innerHTML = localStorage.getItem("Symbol1");
//document.getElementById("storage1").querySelector("#price").innerHTML = localStorage.getItem("Price1");


//document.getElementById("storage1").querySelector("#symbol").innerHTML = localStorage.getItem(slotID);


/*
document.getElementById("storage2").querySelector("#symbol").innerHTML = localStorage.getItem("Symbol2");
document.getElementById("storage2").querySelector("#price").innerHTML = localStorage.getItem("Price2");
*/

let localSlot = "";



function currentSlot(slotNum)
{
	let slotID = "slot" + slotNum;
	let symbol = slot[slotNum - 1];
	//symbol = "IBM"; 
	localSlot = symbol; 
	localStorage.setItem("currentSlot", localSlot);
    consoleLog(localSlot);

}

localSlot = localStorage.getItem("currentSlot");


function util()
{
	getInfo(1); 
	graph(1); 
}

function set ()
{
	indexLoad();

	for (let i = 1; i < 11; i++)
	{
	loadStock(i);
	}

}

const loadStock = (slotNum) => {
	/*
		take input
		make API call
		override global var
		override innerHTMLs
	*/

	let input = slot[slotNum -1];
	let call = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + input + "&apikey=TQEYVSSUFEDJAQU5";

	
	if (input != "")
	{
	$.getJSON(call)
	.done(function(data){
		let price = data["Global Quote"]["05. price"];
		let symbol = data["Global Quote"]["01. symbol"];
		
		if (price != undefined) {
			let slotID = "slot" + slotNum;
			document.getElementById(slotID).querySelector("#symbol").innerHTML = symbol;
			document.getElementById(slotID).querySelector("#price").innerHTML = price;
		}
		
	});
	}


};