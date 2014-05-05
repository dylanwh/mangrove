package Mangrove::Resource;
use strict;
use warnings;
use JSON ();
use Moose;
use MooseX::NonMoose;

extends 'Web::Machine::Resource';

has 'context' => (
    is      => 'rw',
    builder => 'default_context',
);

sub default_context { +{} }

has 'error' => (
    reader    => 'error',
    writer    => 'set_error',
    predicate => 'is_error',
    clearer   => 'clear_error',
);

sub finish_request {
    my ($self, $metadata) = @_;

    if ($self->is_error) {
        $self->response->status(500);
    }
}

1;
