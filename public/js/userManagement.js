// File: public/js/userManagement.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Load existing users immediately
  loadUsers();

  // 2) Handle form submission for adding a new user
  const addUserForm = document.getElementById('addUserForm');
  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const fullName = document.getElementById('fullName').value.trim();
      const username = document.getElementById('username').value.trim();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const phone    = document.getElementById('phone').value.trim();

      // Create request body
      const newUser = { fullName, username, email, password, phone };

      // Send POST /api/users
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error creating user:', errorData);
        alert(`Error creating user: ${errorData.message || 'Unknown error'}`);
        return;
      }

      alert('User created successfully!');
      addUserForm.reset();
      loadUsers(); // Refresh the table
    } catch (err) {
      console.error('Error creating user:', err);
    }
  });

  // 3) Handle form submission for updating an existing user
  const updateUserForm = document.getElementById('updateUserForm');
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const userId     = document.getElementById('updateUserId').value;
      const fullName   = document.getElementById('updateFullName').value.trim();
      const username   = document.getElementById('updateUsername').value.trim();
      const email      = document.getElementById('updateEmail').value.trim();
      const password   = document.getElementById('updatePassword').value.trim();
      const phone      = document.getElementById('updatePhone').value.trim();

      // Build the updated user object
      const updatedUser = { fullName, username, email, phone };
      // Only include a new password if provided
      if (password) {
        updatedUser.password = password;
      }

      // Send PUT /api/users/:id
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error updating user:', errorData);
        alert(`Error updating user: ${errorData.message || 'Unknown error'}`);
        return;
      }

      alert('User updated successfully!');
      updateUserForm.reset();
      document.getElementById('update-user-section').style.display = 'none';
      document.getElementById('add-user-section').style.display = 'block';
      loadUsers(); // Refresh the table
    } catch (err) {
      console.error('Error updating user:', err);
    }
  });

  // 4) Cancel update => hide the update form, show "Add" form
  document.getElementById('cancelUpdate').addEventListener('click', () => {
    document.getElementById('updateUserForm').reset();
    document.getElementById('update-user-section').style.display = 'none';
    document.getElementById('add-user-section').style.display = 'block';
  });
});

/**
 * Load all users from /api/users and populate the table
 */
async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const users = await res.json();
    
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
      const row = document.createElement('tr');

      // Full Name
      const tdFullName = document.createElement('td');
      tdFullName.textContent = user.fullName;
      row.appendChild(tdFullName);

      // Username
      const tdUsername = document.createElement('td');
      tdUsername.textContent = user.username;
      row.appendChild(tdUsername);

      // Email
      const tdEmail = document.createElement('td');
      tdEmail.textContent = user.email;
      row.appendChild(tdEmail);

      // Phone
      const tdPhone = document.createElement('td');
      tdPhone.textContent = user.phone || '';
      row.appendChild(tdPhone);

      // Actions (Edit/Delete)
      const tdActions = document.createElement('td');
      
      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        showUpdateForm(user);
      });
      tdActions.appendChild(editBtn);

      // Delete Button
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        deleteUser(user._id);
      });
      tdActions.appendChild(delBtn);

      row.appendChild(tdActions);
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading users:', err);
  }
}

/**
 * Show the update form pre-filled with an existing user's data
 */
function showUpdateForm(user) {
  // Hide add-user section, show update section
  document.getElementById('add-user-section').style.display = 'none';
  document.getElementById('update-user-section').style.display = 'block';

  // Fill the update form with user data
  document.getElementById('updateUserId').value = user._id;
  document.getElementById('updateFullName').value = user.fullName;
  document.getElementById('updateUsername').value = user.username;
  document.getElementById('updateEmail').value = user.email;
  document.getElementById('updatePassword').value = ''; // blank
  document.getElementById('updatePhone').value = user.phone || '';
}

/**
 * Delete a user
 */
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errorData = await res.json();
      alert(`Error deleting user: ${errorData.message || 'Unknown error'}`);
      return;
    }

    alert('User deleted successfully!');
    loadUsers(); // Refresh the table
  } catch (err) {
    console.error('Error deleting user:', err);
  }
}
