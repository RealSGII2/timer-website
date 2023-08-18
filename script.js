const $ = q => document.querySelector(q);
const $i = i => $('#s' + i);

const formatTime = (str) => {
	console.log(str)
	const s = str.padStart(4, '0').slice(0, 2) + ':' + str.padStart(4, '0').slice(2);
	
	return new Date('Jan 1, 1970 00:' + s).toLocaleTimeString('en-US', { timeStyle: 'medium', hour12: false }).slice(3).replace(':', '');
}

let currentDate;
let currentInterval;
let isCleared = true;
let isRunning = false;

const updateClockEditor = () => {
	let value = $('input').value;
	value = value.replace(/\D/g, '');
	
	if (value.length > 4) {
		value = value.slice(value.length - 4);
	}
	
	$('input').value = value;
	
	value = value.padStart(4, '0');
	// $('#v').innerText = value;

	const firstDigit = value.match(/[1-9]/)
	const firstDigitIndex = firstDigit ? value.indexOf(firstDigit) : 4;
	
	for (let preindex in value) {
		const letter = value[preindex];
		const index = value.length - preindex - 1;
		
		const text = letter ?? '0';
		
		$i(index).innerText = text;
		
		if (firstDigitIndex > preindex && text == '0')
			$i(index).classList.add('unsure');
		else
			$i(index).classList.remove('unsure');
	}
}

$('input').addEventListener('input', updateClockEditor)

$('input').addEventListener('focusout', () => {
	$('input').value = formatTime($('input').value);
	updateClockEditor();
});

const start = () => {
	isRunning = true;
	document.body.classList.add('running');
	$('#start span').innerText = 'Stop'
	
	currentInterval = setInterval(() => {
		const value = $('input').value;
		
	
	const s = value.padStart(4, '0').slice(0, 2) + ':' + value.slice(2);
		
		const date = new Date('Jan 1, 1970 00:' + s);
		
		date.setSeconds(date.getSeconds() - 1);
		
		const timeString = date.toLocaleTimeString('en-US', { timeStyle: 'medium', hour12: false }).slice(3).replace(':', '');
		
		$('input').value = timeString
		updateClockEditor();
		
		if (timeString == '0000') {
			clearInterval(currentInterval);
			
			document.body.classList.remove('running');
			document.body.classList.add('done');
			$('#start span').innerText = 'Clear'
			
			$('audio').play();
			
			isCleared = false;
		}
	}, 1000)
}

$('#start').addEventListener('click', () => {
	if (!isRunning) {
		start();
	} else {
		if (isCleared) {
			clearInterval(currentInterval);
			document.body.classList.remove('running');
			isRunning = false;
			
			$('#start span').innerText = 'Start'
		} else {
			document.body.classList.remove('done', 'running');
			$('audio').load();
			isCleared = true;
			isRunning = false;
			$('#start span').innerText = 'Start'
		}
	}
});

let mouseTimeout;
addEventListener('mousemove', () => {
	document.body.classList.add('hover');
	
	if (mouseTimeout)
		clearTimeout(mouseTimeout)
	
	mouseTimeout = setTimeout(() => {
		document.body.classList.remove('hover');
	}, 1000);
});
