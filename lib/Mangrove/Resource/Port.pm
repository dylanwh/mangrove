package Mangrove::Resource::Port;
use strict;
use warnings;
use JSON ();
use Moose;
use MooseX::NonMoose;
use Try::Tiny;
use Web::Machine::Util 'bind_path';

extends 'Web::Machine::Resource';

has 'context' => ( is => 'rw' );

has 'schema' => (
    is       => 'ro',
    isa      => 'Mangrove::Schema',
    required => 1,
);

has 'json' => (
    is      => 'ro',
    lazy    => 1,
    default => sub { JSON::XS->new->allow_nonref->allow_blessed->convert_blessed->pretty },
);

sub content_types_provided { [ { 'application/json' => 'to_json' } ] }
 sub content_types_accepted { [ { 'application/json' => 'from_json' } ] }

sub allowed_methods {
    my $self = shift;
    return [
        qw[ GET HEAD PUT ],
        # ( $self->request->path_info eq '/' ? () : 'DELETE' ),
    ];
}

sub to_json {
    my $self = shift;

    return $self->json->encode( $self->context );
}

sub from_json {
    my $self = shift;
    my $port = $self->json->decode( $self->request->content );

    if ( my $id = bind_path( '/:id', $self->request->path_info ) ) {
        $port->{id} = $id;
        $self->schema->resultset('Port')->find_or_create( $port );
    }
    else {
        $self->schema->resultseT('Port')->create( $port );
    }
}

sub resource_exists {
    my $self = shift;
    if ( my $id = bind_path( '/:id', $self->request->path_info ) ) {
        $self->context( $self->schema->resultset('Port')->find({id => $id}) );
    }
    else {
        $self->context( [ $self->schema->resultset('Port')->all ] );
    }
}


1;
