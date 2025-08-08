const { execSync } = require('child_process');
require('dotenv').config();
const fs = require('fs');

/**
 * Commits and pushes changes to GitHub
 * @param {Object} options - Options object
 * @param {string} options.commitMessage - Commit message to use (defaults to "Prompt from Manifest")
 * @returns {Object} Result object with status and message
 */
function commitAndPushChanges(options = {}) {
    const { commitMessage = "Prompt from Manifest" } = options;
    
    try {

        // Configure git user identity if not already set
        try {
            execSync('git config user.name', { stdio: 'ignore' });
        } catch (err) {
            // Set git user name and email
            execSync('git config user.name "Manifest Bot"');
            execSync('git config user.email "manifest@example.com"');
        }

        // Commit all changes and push to GitHub
        const commitResult = execSync(`git add . && git commit -m "${commitMessage}" && git push`);
        
        console.log(commitResult.toString());
        
        return {
            success: true,
            message: "Successfully committed and pushed changes to GitHub",
            status: "success"
        };
    } catch (error) {
        console.error('Git operation failed:', error.message);
        
        // Check if the error is due to no changes to commit
        if (error.message.includes('nothing to commit') || error.message.includes('no changes added to commit')) {
            return {
                success: true,
                message: "No changes to commit - working directory is clean",
                status: "no_changes",
                details: "There are no modified files to commit and push to GitHub"
            };
        } else {
            // Handle other git errors
            return {
                success: false,
                message: "Failed to commit and push changes to GitHub",
                status: "error",
                details: error.message
            };
        }
    }
}

module.exports = {
    commitAndPushChanges
}; 