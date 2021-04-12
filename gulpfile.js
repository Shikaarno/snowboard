const { src, dest, gulp, series } = require('gulp');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

const pathProject = {
	'src': "./src/",
	'dest': "./dest/",
	'img': "img"
};

function cleanDest() {
	return src(pathProject.dest + "**/", {read: false})
		.pipe(clean());
} 
// минимизация картинки и перенос в нужную папку
function dropImgs() {
	var images = ['jpg', 'png', 'bmp', 'jpeg'];
	var path = [];
	for ( let i = 0; i < images.length; i++ ){
		path.push(pathProject.src + pathProject.img + "**/*." + images[i])
	};
	return src(path)
		//.pipe(imagemin())
		.pipe(dest(pathProject.dest))
};

// магический шар для гадания
function magicBall() {
	var magic = Math.floor(Math.random() * 6);
	if (magic >= 4) {
		console.log("Да, сделай это!")
	} else {
		console.log("Нет, сегодня не лучший день!")
	};
};
// компиляция less файла в css файл
function lessToCss() {
	return src(pathProject.src + "less/pages/*.less")
	.pipe(less())
	.pipe(dest(pathProject.src + "less/css"))
	.pipe(browserSync.stream());
};


// собираем все css файлы в разработческой папке в один CSS файл и пихаем его в чистовик
function concatCSS() {
	return src(pathProject.src + "less/css/*.css")
		.pipe(concat("style.min.css"))
		.pipe(dest(pathProject.dest + "css"))
		.pipe(browserSync.stream());
};

// пишем свой лайврелоад
function html() { // служебная программа для browserSync() 
	return src(pathProject.dest + "*.html")
		.pipe(dest(pathProject.dest))
		.pipe(browserSync.stream());
};

function pugCompile() {
	return src(pathProject.src + "pug/index.pug")
		.pipe(pug())
		.pipe(dest(pathProject.dest))
		.pipe(browserSync.stream());
};

function mainPageCompile() {
	return src(pathProject.src + "pug/main_page.pug")
		.pipe(pug())
		.pipe(dest(pathProject.dest))
		.pipe(browserSync.stream());
};

function fonts() {
	return src(pathProject.src + "fonts/**")
		.pipe(dest(pathProject.dest + "fonts"));
}

function bootstrapCSS() {
	return src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
		.pipe(dest(pathProject.src + "less/css"))
};

function bootstrapJS() {
	return src("./node_modules/bootstrap/dist/js/bootstrap.js")
		.pipe(dest(pathProject.dest + "js"))
};

function resetCss() {
	return src("./node_modules/reset-css/less/reset.less")
		.pipe(dest(pathProject.src + "less/css"))
};

//function css() {
//	return src("./dest/css/*.css")
//		.pipe(dest("./dest/css"))
//		.pipe(browserSync.stream());
//}

function liveReload() {
	browserSync.init({
		server: {
			baseDir: pathProject.dest
		},
		browser: 'chrome',
		notify: false
	});

	browserSync.watch(pathProject.src + "pug/**/*.pug", pugCompile);
	browserSync.watch(pathProject.src + "less/css/*.css", concatCSS);
	browserSync.watch(pathProject.src + "less/**/*.less", lessToCss);//.on('change', browserSync.reload);
};


function fontAwesomeFonts() {
	return src("./node_modules/@fortawesome/fontawesome-free/webfonts/*.*")
		.pipe(dest(pathProject.dest + "webfonts"))
};

function fontAwesomeIcons() {
	return src("./node_modules/@fortawesome/fontawesome-free/css/all.min.css")
		.pipe(dest(pathProject.src + "less/css"))
};

exports.clean = cleanDest;
exports.concat = concatCSS;
exports.icon = fontAwesomeIcons;
exports.font = fontAwesomeFonts;
exports.ball = magicBall;
exports.sync = liveReload;
//exports.drop = dropImgs;
exports.less = lessToCss;
exports.pug = pugCompile;
exports.build = series(cleanDest,
	resetCss, 	
	//bootstrapCSS,
	fonts, 
	bootstrapJS, 
	fontAwesomeIcons, 
	fontAwesomeFonts, 
	dropImgs, 
	lessToCss,
	concatCSS,
	pugCompile,
	mainPageCompile);

exports.mainPage = mainPageCompile;