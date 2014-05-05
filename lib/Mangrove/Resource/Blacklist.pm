package Mangrove::Resource::Blacklist;
use strict;
use warnings;
use Moose;
use Try::Tiny;
use Web::Machine::Util 'bind_path';

extends 'Mangrove::Resource';

with 'Mangrove::Resource::Role::Schema',
     'Mangrove::Resource::Role::ToJSON';

sub result_source;

has 'blacklist' => (
    is       => 'rw',
    isa      => 'DBIx::Class::ResultSet',
    required => 1,
    handles  => [ 'result_source', 'find_or_create', 'create' ],
);

sub post_is_create { 1 }

sub create_path {
    # broken, need to know next id...
    '/1';
}

sub content_types_accepted { [ { 'application/json' => 'from_json' } ] }

sub allowed_methods {
    my $self  = shift;
    my %allow = (
        GET    => 1,
        HEAD   => 1,
        POST   => 1,
        PUT    => $self->request->path_info ne '/',
        DELETE => $self->request->path_info ne '/',
    );

    return [ grep { $allow{$_} } keys %allow ];
}

sub from_json {
    my $self = shift;

}

sub resource_exists {
    my $self = shift;

    if ( my $id = bind_path( '/:blacklist_id', $self->request->path_info ) ) {
        my $blacklist_entry = $self->blacklist->find($id);
        if ($blacklist_entry) {
            $self->context($blacklist_entry);
            return 1;
        }
        else {
            return 0;
        }
    }
    else {
        $self->context( [ $self->blacklist->all ] );
        return 1;
    }

}

1;
