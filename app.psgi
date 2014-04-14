#!/usr/bin/env perl
use strict;
use warnings;
use local::lib;

use Plack::Builder;
use Plack::App::File;
use Plack::App::Directory;
use Plack::Middleware::Static;
use Web::Machine;
use Guano::Schema;
use Guano::Resource::Port;

my $app_dir = '../guano-frontend/dist/app';

my $schema = Guano::Schema->connect( 'dbi:Pg:dbname=system', 'guano', 'batshit' )
    or die;

my $resource_port = Web::Machine->new(
    resource      => 'Guano::Resource::Port',
    resource_args => [ schema => $schema ]
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


