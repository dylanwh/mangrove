package Mangrove::Resource::Role::Schema;
use Moose::Role;

requires 'result_source';

has 'schema' => (
    is       => 'ro',
    lazy     => 1,
    builder  => '_build_schema',
);

sub _build_schema {
    my ($self) = @_;

    return $self->result_source->schema;
}

1;
