# phaser project

NPM = $(shell which npm || echo "npm")

all: node_modules

start: node_modules
	npm start </dev/null

stop:
	killall npm

dist:
	npm run dist </dev/null

node_modules: package.json $(NPM)
	npm install

clean:
	rm -rf node_modules

$(NPM):
	@echo "Need to install npm!"
	@[ ! -e /etc/centos-release ] || make INSTALL_CENTOS
	@uname -a | grep -vi darwin || make INSTALL_OSX
	@which npm || exit 1
	@sleep 2
	make $*

INSTALL_CENTOS:
	@echo Installing nodejs repo ...
	@grep -v 'release 7' /etc/centos-release || [ -e /etc/yum.repos.d/epel.repo ] || sudo yum install epel-release
	@grep -v 'release 6' /etc/centos-release || [ ! -e /etc/yum.repos.d/nodesource-el6.repo ] || curl -sL https://rpm.nodesource.com/setup_9.x | sudo -E bash -
	@echo Installing nodejs ...
	@sudo yum install nodejs

INSTALL_OSX:
	@echo Installing brew ...
	@which brew || /usr/bin/ruby -e "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	@which brew || exit 1
	@echo Installing npm ...
	@which npm || brew install node