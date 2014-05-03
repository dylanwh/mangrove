#!/usr/bin/env perl
use strict;
use warnings;
use local::lib 'perl_modules';

use Plack::Builder;
use Plack::App::File;
use Plack::App::Directory;
use Plack::Middleware::Static;
use Web::Machine;
use Mangrove::Schema;
use Mangrove::Resource::Ports;

my $app_dir = 'app';

my $schema = Mangrove::Schema->connect( 'dbi:Pg:dbname=system', 'guano', 'batshit' )
    or die;

my $resource_port = Web::Machine->new(
    resource      => 'Mangrove::Resource::Ports',
    resource_args => [ ports => $schema->resultset('Port') ],
    tracing => 1,
);

builder {
    enable "Plack::Middleware::XSendfile";
    enable "Plack::Middleware::Static",
        path => qr{^/(components|images|styles|scripts|templates)/},
        root => $app_dir;
    enable "Plack::Middleware::Static",
        path => sub { s{^/([^/]+\.html)?$}{/index.html} },
        root => $app_dir;

    mount "/api/ports" => $resource_port->to_app;
    mount "/"          => Plack::App::Directory->new(root => $app_dir)->to_app;
};


