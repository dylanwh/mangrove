package Mangrove::Resource::Ports;
use strict;
use warnings;
use Moose;
use Try::Tiny;
use Web::Machine::Util 'bind_path';

extends 'Mangrove::Resource';

with 'Mangrove::Resource::Role::Schema',
     'Mangrove::Resource::Role::ToJSON';

sub result_source;

has 'ports' => (
    is       => 'rw',
    isa      => 'DBIx::Class::ResultSet',
    required => 1,
    handles  => [ 'result_source', 'find_or_create', 'create' ],
);

sub content_types_accepted { [ { 'application/json' => 'from_json' } ] }

sub allowed_methods {
    my $self  = shift;
    my %allow = (
        GET    => 1,
        HEAD   => 1,
        PUT    => $self->request->path_info ne '/',
        DELETE => $self->request->path_info ne '/',
    );

    return [ grep { $allow{$_} } keys %allow ];
}

sub from_json {
    my $self = shift;

    my $error;
    try {
        $self->schema->txn_do(sub {
            if ( my $iface = bind_path( '/:id', $self->request->path_info ) ) {
                my $ports   = $self->json->decode( $self->request->content );
                my @columns = $self->ports->result_class->columns;
                my @keep    = map { $_->{id} } grep { $_->{id} } @$ports;

                $self->ports->search({id => { -not_in => \@keep }})->delete;

                for my $port (@$ports) {
                    my %port = map { ($_, $port->{$_}) } @columns;

                    if (defined $port{id}) {
                        $self->find_or_create( \%port, { key => 'primary' });
                    }
                    else {
                        delete $port{id};
                        $self->create(\%port);
                    }
                }
            }
            else {
                return \404;
            }
        });
    }
    catch {
        $error = $_;
    };


    if ($error) {
        warn $error;
        $self->response->content($error);
        return \500;
    }
}

sub resource_exists {
    my $self = shift;

    if ( my $iface = bind_path( '/:id', $self->request->path_info ) ) {
        # TODO, conditional on the interface name.
        try {
            $self->context([ $self->ports->all ] );
        }
        catch {
            $self->set_error("$_");
        };
        return 1;
    }

    return 0;
}

1;
