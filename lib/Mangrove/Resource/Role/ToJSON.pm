package Mangrove::Resource::Role::ToJSON;
use Moose::Role;
use JSON ();

has 'json' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_build_json',
);

sub content_types_provided { [ { 'application/json' => 'to_json' } ] }

sub _build_json {
    return JSON->new->allow_nonref->allow_blessed->convert_blessed->pretty;
}

sub to_json {
    my $self = shift;

    return $self->json->encode( $self->is_error ? $self->error : $self->context );
}

1;
