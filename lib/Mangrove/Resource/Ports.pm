package Mangrove::Resource::Ports;
use strict;
use warnings;
use JSON ();
use Moose;
use MooseX::NonMoose;
use Try::Tiny;
use Web::Machine::Util 'bind_path';

extends 'Web::Machine::Resource';

has 'ports' => (
    is       => 'rw',
    isa      => 'DBIx::Class::ResultSet',
    required => 1,
    handles  => [ 'find_or_create', 'create' ],
);

has 'context' => (
    traits  => ['Hash'],
    reader  => '_context',
    handles => { context => 'accessor', 'is_error' => [ 'exists', 'error' ] },
    default => sub { +{} },
);

has 'schema' => (
    is       => 'ro',
    lazy     => 1,
    builder  => '_build_schema',
);

has 'json' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_build_json',
);

sub content_types_provided { [ { 'application/json' => 'to_json' } ] }
sub content_types_accepted { [ { 'application/json' => 'from_json' } ] }

sub _build_json {
    return JSON::XS->new->allow_nonref->allow_blessed->convert_blessed->pretty;
}

sub _build_schema {
    my ($self) = @_;

    return $self->ports->result_source->schema;
}

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

sub to_json {
    my $self = shift;

    return $self->json->encode( $self->_context );
}

sub finish_request {
    my ($self, $metadata) = @_;

    if ($self->is_error) {
        $self->response->status(500);
    }
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
            $self->context( ports => [ $self->ports->all ] );
        }
        catch {
            $self->context( error=> "$_" );
            $self->response->status(500);
            return \500;
        };
        return 1;
    }

    return 0;
}


1;
