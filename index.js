var Crawler = require('./crawler'),
	Parser = require('./parser_2'),
	home_router = 'http://www.crunchyroll.com/tech-challenge/roaming-math/neablis121@gmail.com/',
	parser = new Parser(),
	crawler = new Crawler({'home_router': home_router, 'parser': parser}),
	start_equation = 'abs(add(multiply(41,abs(27925)),abs(add(197,multiply(-1,35726)))))',
	responses = {};

	var solution = parser.solve(start_equation);

	crawler.crawl(solution);

//var results = crawler.string_to_equation(start_equation);
//var solution = parser.solve(results);


/*
'abs(add(multiply(41,abs(27925)),abs(add(197,multiply(-1,35726)))))'
1180454
*/