use utf8;
package Mangrove::Schema::Result::Port;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Mangrove::Schema::Result::Port

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 COMPONENTS LOADED

=over 4

=item * L<DBIx::Class::InflateColumn::DateTime>

=back

=cut

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 TABLE: C<ports>

=cut

__PACKAGE__->table("ports");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'ports_id_seq'

=head2 source_address

  data_type: 'inet'
  is_nullable: 0

=head2 source_port

  data_type: 'port_number'
  is_nullable: 0
  size: 4

=head2 destination_address

  data_type: 'inet'
  is_nullable: 0

=head2 destination_port

  data_type: 'port_number'
  is_nullable: 0
  size: 4

=cut

__PACKAGE__->add_columns(
  "id",
  {
    data_type         => "integer",
    is_auto_increment => 1,
    is_nullable       => 0,
    sequence          => "ports_id_seq",
  },
  "source_address",
  { data_type => "inet", is_nullable => 0 },
  "source_port",
  { data_type => "port_number", is_nullable => 0, size => 4 },
  "destination_address",
  { data_type => "inet", is_nullable => 0 },
  "destination_port",
  { data_type => "port_number", is_nullable => 0, size => 4 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.07039 @ 2014-04-14 00:30:25
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:4tu5tA8YYAOLUI+HeFwHQQ

sub TO_JSON {
    my ($self) = @_;
    return +{ map { ( $_, $self->$_ ) } qw( id source_address source_port destination_address destination_port ) };
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
