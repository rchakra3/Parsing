var fs = require('fs');
var buf = fs.readFileSync("sample.json");

//console.log( buf.toString() );

var tokens = 
[
	"LBRACE",
	"RBRACE",
	"LBRACKET",
	"RBRACKET",
	"COLON",
	"QUOTE",
	"IDENT"
];

var scanner =
{
	tokens: [],
	bufPosition: 0,
	tokenize: function( buffer )
	{
		while( scanner.bufPosition < buffer.length )
		{
			var char = String.fromCharCode(buffer.readUInt8(scanner.bufPosition++));
			var token = scanner.getToken(char,buffer);
			scanner.tokens.push( token );

			//buffer.slice(scanner.bufPosition);
		}
		return scanner.tokens;
	},

	getToken: function (c,buffer) 
	{
		if( c == '{' )
			return "LBRACE";

		if( c == '}' )
			return "RBRACE";

		if( c == "\"")
			return "QUOTE"

		// Task match []

		// Task consume: White space

		// Match identifiers
		var buf = "";
		if( /[a-zA-Z0-9]/.test( c ) )
		{
			while( /[a-zA-Z0-9]/.test( c ) ) 
			{
				buf += c;
				c = String.fromCharCode(buffer.readUInt8(scanner.bufPosition++));
			}
			scanner.bufPosition--;
			return "ID_"+buf;
		}

		return "UNKNOWN";
	}
};

// Recursive decent parser
var parser =
{
	AST: {},
	tokenPos: 0,
	parse: function (tokens) 
	{
		if( parser.isObject() )
		{
			return true;
		}
		return false;
	},

	isObject: function () 
	{
		parser.expect("LBRACE");
		parser.expect("QUOTE");
		if( parser.peek().indexOf( "ID_" ) == 0 )
		{
			parser.consume();
			parser.expect("QUOTE");
			parse.expect("COLON");

			if( parser.isValue() )
			{
				return true;
			}
			return false;
		}
		return false;
	},

	isValue: function () 
	{
		return true;
	},

	expect: function(token)
	{
		if( tokens[parser.tokenPos] != token )
		{
			console.error( "Expected ", token, "Received: ", tokens[parser.tokenPos])
			process.exit();
		}
		console.log("Accepted: ", token);
		parser.consume();
	},

	peek: function()
	{
		return tokens[parser.tokenPos];
	},

	consume: function() 
	{
		return tokens[parser.tokenPos++];
	}
}

var tokens = scanner.tokenize( buf );
console.log(tokens);
console.log( parser.parse(tokens) );


