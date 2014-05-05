use utf8;
package Mangrove::Schema::Result::Blacklist;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Mangrove::Schema::Result::Blacklist

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

=head1 TABLE: C<blacklist>

=cut

__PACKAGE__->table("blacklist");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'blacklist_id_seq'

=head2 address

  data_type: 'inet'
  is_nullable: 0

=head2 reason

  data_type: 'text'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "id",
  {
    data_type         => "integer",
    is_auto_increment => 1,
    is_nullable       => 0,
    sequence          => "blacklist_id_seq",
  },
  "address",
  { data_type => "inet", is_nullable => 0 },
  "reason",
  { data_type => "text", is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.07039 @ 2014-05-04 19:46:37
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:8xQCSead8kIqSIJy86a6QA

sub TO_JSON {
    my ($self) = @_;
    return +{ map { ( $_, $self->$_ ) } $self->columns };
}

# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
