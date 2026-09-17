from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.utils.safestring import mark_safe

from .models import User


class AdminUserChangeForm(UserChangeForm):
    """Show the stored password hash compactly in the Django Admin.

    The field remains read-only. Password hashes are deliberately not
    editable: a password must always be changed through Django's reset form.
    """

    password = forms.CharField(
        label='Password',
        required=False,
        widget=forms.TextInput(attrs={'class': 'vTextField', 'readonly': 'readonly'}),
        help_text=mark_safe(
            'This is a protected password hash, not the actual password. '
            '<a href="../password/">Reset password</a> to choose a new one.'
        ),
    )

    class Meta(UserChangeForm.Meta):
        model = User
