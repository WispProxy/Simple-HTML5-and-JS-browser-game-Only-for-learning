/*
 * Default values
 * -------------------------------------------------------------------------------------------------------------------*/
var _canvas, _ctx,
	_backgroundImage,
	_iBackgroundShiftX 				= 100,

	/*
	* Game objects
	* */
	_hero,
	_balls 							= [],
	_enemies						= [],

	_heroW 							= 75,
	_heroH 							= 70,
	_iSpritePos 					= 0,
	_iSpritePosHero 				= 0,
	_iEnemyW 						= 128,
	_iEnemyH 						= 128,
	_iBallSpeed 					= 15,
	_iEnemySpeed 					= 3,

	/*
	* Sounds
	* */
	_heroSound,
	_propellerSound,
	_explodeSound, _explodeSound2,
	_enemyGoneSound,

	/*
	* Mouse status
	* */
	_bMouseDown 					= false,
	_iLastMouseX 					= 0,
	_iLastMouseY 					= 0,
	_iScore 						= 0;
/*
 * END Default values
 * -------------------------------------------------------------------------------------------------------------------*/



/*
 * Create functions objects
 * -------------------------------------------------------------------------------------------------------------------*/
function Hero( x, y, w, h, image )
{
	this.x 		= x;
	this.y 		= y;
	this.w 		= w;
	this.h 		= h;
	this.image 	= image;
	this.bDrag 	= false;
}

function Ball( x, y, w, h, speed, image )
{
	this.x 		= x;
	this.y 		= y;
	this.w 		= w;
	this.h 		= h;
	this.speed 	= speed;
	this.image 	= image;
}

function Enemy( x, y, w, h, speed, image )
{
	this.x 		= x;
	this.y 		= y;
	this.w 		= w;
	this.h 		= h;
	this.speed 	= speed;
	this.image 	= image;
}
/*
 * END Create functions objects
 * -------------------------------------------------------------------------------------------------------------------*/



/*
 * Create general functions
 * -------------------------------------------------------------------------------------------------------------------*/
function getRand( x, y )
{
	return Math.floor( Math.random() * y ) + x;
}

function drawScene()
{
	_ctx.clearRect( 0, 0, _ctx.canvas.width, _ctx.canvas.height );

	_iBackgroundShiftX += 4;
	if( _iBackgroundShiftX >= 1535 )
	{
		_iBackgroundShiftX = 0;
	}
	_ctx.drawImage( _backgroundImage, 0 + _iBackgroundShiftX, 0, 1000, 940, 0, 0, 1000, 600 );

	_iSpritePos++;
	if( _iSpritePos >= 9 )
	{
		_iSpritePos = 0;
	}

	/*
	 * Hero go to mouse
	 * */
	if( _bMouseDown )
	{
		if( _iLastMouseX > _hero.x )
		{
			_hero.x += 5;
		}
		if( _iLastMouseY > _hero.y )
		{
			_hero.y += 5;
		}
		if( _iLastMouseX < _hero.x )
		{
			_hero.x -= 5;
		}
		if( _iLastMouseY < _hero.y )
		{
			_hero.y -= 5;
		}
	}

	/*
	* Draw hero
	* */
	_ctx.drawImage( _hero.image, _iSpritePos * _hero.w, _iSpritePosHero * _hero.h, _hero.w, _hero.h, _hero.x - _hero.w / 2, _hero.y - _hero.h / 2, _hero.w, _hero.h );

	/*
	 * Draw ball
	 * */
	if( _balls.length > 0 )
	{
		for( var key in _balls )
		{
			if( _balls[ key ] != undefined )
			{
				_ctx.drawImage( _balls[ key ].image, _balls[ key ].x, _balls[ key ].y );
				_balls[ key ].x += _balls[ key ].speed;

				if( _balls[ key ].x > _canvas.width )
				{
					delete _balls[ key ];
				}
			}
		}
	}

	/*
	 * Draw enemy's
	 * */
	if( _enemies.length > 0 )
	{
		for( var ekey in _enemies )
		{
			if( _enemies[ ekey ] != undefined )
			{
				_ctx.drawImage( _enemies[ ekey ].image, _enemies[ ekey ].x, _enemies[ ekey ].y );
				_enemies[ ekey ].x += _enemies[ ekey ].speed;

				if( _enemies[ ekey ].x < -_iEnemyW )
				{
					delete _enemies[ ekey ];
					_iScore--;

					_enemyGoneSound.currentTime = 0;
					_enemyGoneSound.play();
				}
			}
		}
	}

	/*
	 * Detect hit
	 * */
	if( _balls.length > 0 )
	{
		for( var key in _balls )
		{
			if( _balls[ key ] != undefined )
			{
				if( _enemies.length > 0 )
				{
					for( var ekey in _enemies )
					{
						if( _enemies[ ekey ] != undefined && _balls[ key ] != undefined )
						{
							if( _balls[ key ].x + _balls[ key ].w
								>
								_enemies[ ekey ].x && _balls[ key ].y + _balls[ key ].h
								>
								_enemies[ ekey ].y && _balls[ key ].y
								<
								_enemies[ ekey ].y + _enemies[ ekey ].h
							  )
							{
								delete _enemies[ ekey ];
								delete _balls[ key ];
								_iScore++;

								_explodeSound2.currentTime = 0;
								_explodeSound2.play();
							}
						}
					}
				}
			}
		}
	}

	/*
	* Reset totals style
	* */
	_ctx.font			= '14px Open Sans';
	_ctx.fillStyle 		= '#0c090a';
	_ctx.fillText( 'Total: ' + _iScore, 920, 580 );
	_ctx.fillText( 'Press "spacebar" to shoot.', 10, 580 );
}
/*
 * END Create general functions
 * -------------------------------------------------------------------------------------------------------------------*/



/*
 * Initialize scene and all objects
 * -------------------------------------------------------------------------------------------------------------------*/
$( function() {
	var oBallImage,
		oEnemyImage,
		oHeroImage,
		enemyTimer					= null;

	function addEnemy()
	{
		clearInterval( enemyTimer );

		var randY = getRand( 0, _canvas.height - _iEnemyH );
		_enemies.push( new Enemy( _canvas.width, randY, _iEnemyW, _iEnemyH, -_iEnemySpeed, oEnemyImage ) );

		var interval = getRand( 500, 1000 );
		/*
		 * Repeat interval
		 * */
		enemyTimer = setInterval( addEnemy, interval );
	}


	_canvas 					= document.getElementById( 'scene' );
	_ctx 						= _canvas.getContext( '2d' );


	_backgroundImage 			= new Image();
	_backgroundImage.src 		= 'project/img/background_scene.jpg';
	_backgroundImage.onload 	= function() {}
	_backgroundImage.onerror 	= function()
	{
		console.log( 'Error' );
	}


	_heroSound 					= new Audio( 'project/wav/cat_hero.wav' );
	_heroSound.volume 			= 0.5;

	_enemyGoneSound 			= new Audio( 'project/wav/explosion.wav' );
	_enemyGoneSound.volume 		= 0.5;

	_explodeSound 				= new Audio( 'project/wav/shoot.wav' );
	_explodeSound.volume 		= 0.5;
	_explodeSound2 				= new Audio( 'project/wav/miss.wav' );
	_explodeSound2.volume 		= 0.5;

	_propellerSound 			= new Audio( 'project/wav/propeller.wav' );
	_propellerSound.volume 		= 0.5;
	_propellerSound.addEventListener( 'ended', function()
	{
		this.currentTime = 0;
		this.play();
	}, false );
	_propellerSound.play();


	oBallImage 					= new Image();
	oBallImage.src 				= 'project/img/ball.png';
	oBallImage.onload 			= function() {}

	oEnemyImage 				= new Image();
	oEnemyImage.src 			= 'project/img/enemy_knu_fly.png';
	oEnemyImage.onload 			= function() {}

	oHeroImage 					= new Image();
	oHeroImage.src 				= 'project/img/hero_tails.gif';
	oHeroImage.onload 			= function()
	{
		_hero = new Hero( 400, 300, _heroW, _heroH, oHeroImage );
	}


	$( '#scene' ).mousedown( function( e )
	{
		var mouseX = e.layerX || 0;
		var mouseY = e.layerY || 0;
		if( e.originalEvent.layerX )
		{
			mouseX = e.originalEvent.layerX;
			mouseY = e.originalEvent.layerY;
		}

		_bMouseDown = true;

		if( mouseX
			>
			_hero.x - _hero.w / 2 && mouseX
			<
			_hero.x - _hero.w / 2 + _hero.w && mouseY
			>
			_hero.y - _hero.h / 2 && mouseY
			<
			_hero.y - _hero.h / 2 + _hero.h
		  )
		{

			_hero.bDrag = true;
			_hero.x = mouseX;
			_hero.y = mouseY;
		}
	} );

	$( '#scene' ).mousemove( function( e )
	{
		var mouseX = e.layerX || 0;
		var mouseY = e.layerY || 0;
		if( e.originalEvent.layerX )
		{
			mouseX = e.originalEvent.layerX;
			mouseY = e.originalEvent.layerY;
		}

		_iLastMouseX = mouseX;
		_iLastMouseY = mouseY;

		if( _hero.bDrag )
		{
			_hero.x = mouseX;
			_hero.y = mouseY;
		}

		if( mouseX > _hero.x && Math.abs( mouseY - _hero.y ) < _hero.w / 2 )
		{
			_iSpritePosHero = 0;
		}
		else if( mouseX < _hero.x && Math.abs( mouseY - _hero.y ) < _hero.w / 2 )
		{
			_iSpritePosHero = 4;
		}
		else if( mouseY > _hero.y && Math.abs( mouseX - _hero.x ) < _hero.h / 2 )
		{
			_iSpritePosHero = 2;
		}
		else if( mouseY < _hero.y && Math.abs( mouseX - _hero.x ) < _hero.h / 2 )
		{
			_iSpritePosHero = 6;
		}
		else if( mouseY < _hero.y && mouseX < _hero.x )
		{
			_iSpritePosHero = 5;
		}
		else if( mouseY < _hero.y && mouseX > _hero.x )
		{
			_iSpritePosHero = 7;
		}
		else if( mouseY > _hero.y && mouseX < _hero.x )
		{
			_iSpritePosHero = 3;
		}
		else if( mouseY > _hero.y && mouseX > _hero.x )
		{
			_iSpritePosHero = 1;
		}
	} );

	$( '#scene' ).mouseup( function( e )
	{
		_hero.bDrag = false;
		_bMouseDown = false;

		_heroSound.currentTime = 0;
		_heroSound.play();
	} );

	$( window ).keydown( function( event )
	{
		switch( event.keyCode )
		{
			case 32: // This - "Spacebar"
				_balls.push( new Ball( _hero.x, _hero.y, 32, 32, _iBallSpeed, oBallImage ) );

				_explodeSound.currentTime = 0;
				_explodeSound.play();
				break;
		}
	} );
	/*
	 * Repeat interval
	 * */
	setInterval( drawScene, 30 );

	addEnemy();
} );
/*
 * END Initialize scene and all objects
 * -------------------------------------------------------------------------------------------------------------------*/
