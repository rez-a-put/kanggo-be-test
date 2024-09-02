"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users Table
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(15),
        unique: true
      },
      email: {
        type: Sequelize.STRING(50),
        unique: true
      },
      role: {
        type: Sequelize.INTEGER,
        comment: "1:admin, 2:customer"
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: "1:active, 2:inactive"
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Workers Table
    await queryInterface.createTable("workers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(9, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: "1:active, 2:inactive"
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Orders Table
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      total_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(12, 2),
        comment: "sum of worker_price in order_detail"
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: "1:paid, 2:cancel"
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Order Detail Table
    await queryInterface.createTable("order_detail", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "orders",
          key: "id"
        },
        allowNull: false
      },
      worker_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "workers",
          key: "id"
        },
        allowNull: false
      },
      worker_price: {
        type: Sequelize.DECIMAL(12, 2),
        comment: "price in table worker * total_days in table orders"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_detail");
    await queryInterface.dropTable("orders");
    await queryInterface.dropTable("workers");
    await queryInterface.dropTable("users");
  }
};
