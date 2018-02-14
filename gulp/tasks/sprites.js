var gulp = require('gulp'),
svgSprite = require('gulp-svg-sprite'),
rename = require ('gulp-rename'),
del = require('del'),
svg2png = require('gulp-svg2png');



var config = {
	shape: {
		spacing: {
			padding: 1
		}
	},
	mode: {
		css: {
			variables: {
				replaceSvgWithPng: function () {
					return function(sprite, render) {
						return render(sprite).split('.svg').join('.png');
					}
				}
			},
			sprite: 'sprite.svg',
			render : {
				css: {
					template: './gulp/templates/sprite.css'
				}
			}
		}
	}
}

gulp.task('beginClean', function() {
	return del(['./app/temp/sprite', './app/assets/images/sprites']);
});

// Generate svg file
gulp.task('createSprite', ['beginClean'], function() {
	return gulp.src('./app/assets/images/icons/**/*.svg')
		.pipe(svgSprite(config))
		.pipe(gulp.dest('./app/temp/sprite'));
});

// Copy the generated CSS file into our modules folder and rename it
gulp.task('copySpriteCSS', ['createSprite'], function() {
	return gulp.src('./app/temp/sprite/css/*.css')
		.pipe(rename('_sprite.css'))
		.pipe(gulp.dest('./app/assets/styles/modules'));
});

gulp.task('createPngCopy', ['createSprite'], function() {
	return gulp.src('./app/temp/sprite/css/*.svg')
		.pipe(svg2png())
		.pipe(gulp.dest('./app/temp/sprite/css'));
});

//Move the svg file to a folder inside images
gulp.task('copySpriteGraphic', ['createPngCopy'], function() {
	return gulp.src('./app/temp/sprite/css/*.{svg,png}')
		.pipe(gulp.dest('./app/assets/images/sprites'));
});



gulp.task('endClean', ['copySpriteGraphic', 'copySpriteCSS'], function() {
	return del('./app/temp/sprite');
});

// Automatically runs the tasks above so we can add new icons easily
gulp.task('icons', ['beginClean', 'createSprite', 'createPngCopy', 'copySpriteCSS', 'copySpriteGraphic', 'endClean']);

