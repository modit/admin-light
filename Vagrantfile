# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
   config.vm.define :docker do |docker|
       docker.vm.box = "precise64"
       docker.vm.box_url = "http://files.vagrantup.com/precise64.box"
       docker.vm.network "forwarded_port", guest: 80, host:58080
       docker.vm.network "forwarded_port", guest: 4243, host: 4243
       $script_docker = <<SCRIPT
wget -q -O - https://get.docker.io/gpg | apt-key add -
echo deb http://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list
apt-get update -qq
apt-get install -q -y --force-yes lxc-docker
usermod -a -G docker vagrant
sed -e 's/DOCKER_OPTS=/DOCKER_OPTS=\"-H 0.0.0.0:4243 -H unix:\\/\\/\\/var\\/run\\/docker.sock\"/g' /etc/init/docker.conf > /vagrant/docker.conf.sed
cp /vagrant/docker.conf.sed /etc/init/docker.conf
rm -f /vagrant/docker.conf.sed
service docker restart
SCRIPT
    $script_fig = <<SCRIPT
apt-get install -q -y --force-yes curl
curl -L https://github.com/orchardup/fig/releases/download/0.5.1/linux > /usr/local/bin/fig
chmod +x /usr/local/bin/fig
SCRIPT
       docker.vm.provision :shell, :inline => $script_docker
       docker.vm.provision :shell, :inline => $script_fig
   end
end